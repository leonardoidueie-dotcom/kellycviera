"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

import { createWoodMaps, type WoodMaps } from "@/lib/wood-texture";

/* -------------------------------------------------------------------------- */
/*  Medidas reais da mesa (em metros — 1 unidade = 1 m)                        */
/* -------------------------------------------------------------------------- */

const TOP_W = 2.2; // 220 cm
const TOP_D = 1.0; // 100 cm
const TOP_T = 0.08; // 8 cm
const HEIGHT = 0.78; // 78 cm
const FRAME = 0.12; // travamento perimetral / cabeceiras
const GROOVE = 0.008; // friso entre pranchas
const PANEL_T = 0.12; // espessura dos painéis do pé
const PANEL_W = 0.22; // largura do painel (no eixo Z)
const FOOT_INSET = 0.35; // recuo do pé em relação à ponta do tampo
const LEAN = 0.07; // inclinação dos painéis para dentro (rad ≈ 4°)

const TOP_Y = HEIGHT - TOP_T / 2; // centro do tampo
const UNDER_TOP = HEIGHT - TOP_T; // face inferior do tampo
const CROSS_T = 0.14; // travessa superior do pé
const SOLE_T = 0.12; // barra que fecha o pé no chão
const LEG_H = UNDER_TOP - CROSS_T - SOLE_T; // altura dos montantes
const FOOT_X = TOP_W / 2 - FOOT_INSET;
const FOOT_Z = 0.30; // meia-distância entre os montantes (no chão)

const INNER_W = TOP_W - FRAME * 2;
const INNER_D = TOP_D - FRAME * 2;
const PLANK_D = (INNER_D - GROOVE * 2) / 3;
const PLANK_Z = [
  -INNER_D / 2 + PLANK_D / 2,
  0,
  INNER_D / 2 - PLANK_D / 2,
];

/** deslocamento vertical do grupo para a mesa ficar centrada no enquadramento */
const GROUP_Y = -HEIGHT / 2;

/** direção da vista padrão (a distância é calculada pelo aspecto do canvas) */
const DEFAULT_DIR = new THREE.Vector3(2.45, 1.5, 2.7).normalize();
/** raio da esfera que envolve a mesa inteira + margem de enquadramento */
const FIT_RADIUS =
  Math.hypot(TOP_W / 2, TOP_D / 2, HEIGHT / 2) * 1.06;
/** quanto a câmera recua quando a mesa está desmontada */
const EXPLODED_FIT = 1.36;
/** as peças sobem ao desmontar, então o centro da órbita sobe junto */
const EXPLODED_LOOK_AT = 0.2;
const MIN_FACTOR = 0.55;
const MAX_FACTOR = 1.5;
const FALLBACK_DIST = 3.8;

/* -------------------------------------------------------------------------- */
/*  Material de madeira                                                        */
/* -------------------------------------------------------------------------- */

function useWoodMaps(seeds: number[]) {
  const maps = useMemo<WoodMaps[]>(
    () => seeds.map((seed) => createWoodMaps({ seed, grain: 1 })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seeds.join(",")],
  );

  useEffect(() => () => maps.forEach((m) => m.dispose()), [maps]);

  return maps;
}

/**
 * Carrega a foto da madeira real da peça (extraída da foto da loja).
 * Se o arquivo não existir, devolve null e o veio procedural assume.
 */
function useFotoMadeira(url: string) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let vivo = true;
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (!vivo) {
          t.dispose();
          return;
        }
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = THREE.MirroredRepeatWrapping;
        t.wrapT = THREE.MirroredRepeatWrapping;
        t.anisotropy = 8;
        setTex(t);
      },
      undefined,
      () => {
        /* sem foto, o veio desenhado por código continua valendo */
      },
    );
    return () => {
      vivo = false;
    };
  }, [url]);

  useEffect(() => () => tex?.dispose(), [tex]);

  return tex;
}

function WoodMaterial({
  maps,
  foto,
  tint = "#ffffff",
  repeat = [1, 1],
}: {
  maps: WoodMaps;
  foto?: THREE.Texture | null;
  tint?: string;
  repeat?: [number, number];
}) {
  const cloned = useMemo(() => {
    const map = (foto ?? maps.map).clone();
    const bumpMap = maps.bumpMap.clone();
    const roughnessMap = maps.roughnessMap.clone();
    for (const t of [map, bumpMap, roughnessMap]) {
      t.needsUpdate = true;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat[0], repeat[1]);
    }
    map.colorSpace = THREE.SRGBColorSpace;
    if (foto) {
      // a foto é uma fatia da mesa real: espelhar evita emenda visível
      map.wrapS = THREE.MirroredRepeatWrapping;
      map.wrapT = THREE.MirroredRepeatWrapping;
    }
    return { map, bumpMap, roughnessMap };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps, foto, repeat[0], repeat[1]]);

  useEffect(
    () => () => {
      cloned.map.dispose();
      cloned.bumpMap.dispose();
      cloned.roughnessMap.dispose();
    },
    [cloned],
  );

  return (
    <meshStandardMaterial
      color={tint}
      map={cloned.map}
      bumpMap={cloned.bumpMap}
      bumpScale={foto ? 0.02 : 0.012}
      roughnessMap={cloned.roughnessMap}
      roughness={0.75}
      metalness={0}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Peças                                                                      */
/* -------------------------------------------------------------------------- */

type PieceProps = {
  size: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  maps: WoodMaps;
  foto?: THREE.Texture | null;
  tint?: string;
  repeat?: [number, number];
  radius?: number;
};

function Piece({
  size,
  position,
  rotation = [0, 0, 0],
  maps,
  foto,
  tint,
  repeat = [1, 1],
  radius = 0.006,
}: PieceProps) {
  return (
    <RoundedBox
      args={size}
      radius={Math.min(radius, Math.min(...size) / 2.2)}
      smoothness={3}
      bevelSegments={2}
      creaseAngle={0.5}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <WoodMaterial maps={maps} foto={foto} tint={tint} repeat={repeat} />
    </RoundedBox>
  );
}

/* -------------------------------------------------------------------------- */
/*  Vista explodida — a mesa se desmonta para mostrar como é feita             */
/* -------------------------------------------------------------------------- */

const ZERO = new THREE.Vector3();

/**
 * Envolve uma peça num grupo que desliza suavemente até o deslocamento de
 * "desmontagem" e volta ao lugar quando a mesa é remontada.
 */
function ExplodingPiece({
  explode,
  exploded,
  instant,
  children,
}: {
  explode: [number, number, number];
  exploded: boolean;
  instant: boolean;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(...explode), [explode]);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const goal = exploded ? target : ZERO;
    if (instant) {
      group.position.copy(goal);
      return;
    }
    // suavização independente do frame rate
    group.position.lerp(goal, 1 - Math.pow(0.004, Math.min(delta, 0.1)));
  });

  return <group ref={ref}>{children}</group>;
}

/** etiqueta que aparece junto da peça quando a mesa está desmontada */
function PartLabel({
  position,
  titulo,
  texto,
  visible,
}: {
  position: [number, number, number];
  titulo: string;
  texto: string;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <Html position={position} center zIndexRange={[15, 0]}>
      <div className="w-40 rounded-md border border-dourado/25 bg-grafite/90 px-2.5 py-2 text-left shadow-lg backdrop-blur">
        <p className="font-display text-[12px] leading-tight text-dourado">
          {titulo}
        </p>
        <p className="mt-1 text-[9px] leading-relaxed text-areia/70">{texto}</p>
      </div>
    </Html>
  );
}

function Mesa({
  maps,
  exploded,
  instant,
}: {
  maps: WoodMaps[];
  exploded: boolean;
  instant: boolean;
}) {
  const [m0, m1, m2, m3] = maps;

  // madeira real da peça, recortada da foto da loja
  const fotoTampo = useFotoMadeira("/texturas/madeira-tampo.jpg");
  // os pés são da mesma madeira; muda só a direção do veio
  const fotoPe = fotoTampo;

  // com a foto real o tom já vem da própria madeira: a variação fica mínima
  const tints = fotoTampo
    ? ["#ffffff", "#f7f2ec", "#fffdf8"]
    : ["#ffffff", "#f6efe6", "#fffaf2"];

  // quanto cada grupo de peças se afasta na vista explodida
  const LIFT = 0.42; // o tampo sobe
  const SPREAD = 0.3; // as pranchas se separam
  const OUT = 0.34; // o travamento sai para fora

  return (
    <group position={[0, GROUP_Y, 0]}>
      {/* ---------------- Tampo ---------------- */}
      {/* pranchas longitudinais, levemente rebaixadas para criar os frisos */}
      {PLANK_Z.map((z, i) => (
        <ExplodingPiece
          key={`prancha-${i}`}
          exploded={exploded}
          instant={instant}
          explode={[0, LIFT + i * 0.06, (i - 1) * SPREAD]}
        >
          <Piece
            size={[INNER_W, TOP_T - 0.004, PLANK_D]}
            position={[0, TOP_Y - 0.002, z]}
            maps={maps[i % maps.length]}
            foto={fotoTampo}
            tint={tints[i]}
            repeat={[2.2, 1]}
          />
          {i === 2 && (
            <PartLabel
              visible={exploded}
              position={[-INNER_W / 2 - 0.16, TOP_Y + 0.16, z]}
              titulo="Pranchas do tampo"
              texto="Três peças de madeira maciça de demolição, 8 cm de espessura, unidas com friso aparente."
            />
          )}
        </ExplodingPiece>
      ))}

      {/* travamento perimetral: longarinas + cabeceiras */}
      <ExplodingPiece
        exploded={exploded}
        instant={instant}
        explode={[0, LIFT * 0.55, -OUT]}
      >
        <Piece
          size={[TOP_W, TOP_T, FRAME]}
          position={[0, TOP_Y, -(TOP_D - FRAME) / 2]}
          maps={m3}
          foto={fotoTampo}
          repeat={[2.4, 1]}
        />
      </ExplodingPiece>
      <ExplodingPiece
        exploded={exploded}
        instant={instant}
        explode={[0, LIFT * 0.55, OUT]}
      >
        <Piece
          size={[TOP_W, TOP_T, FRAME]}
          position={[0, TOP_Y, (TOP_D - FRAME) / 2]}
          maps={m3}
          foto={fotoTampo}
          tint="#faf3ea"
          repeat={[2.4, 1]}
        />
        <PartLabel
          visible={exploded}
          position={[TOP_W / 2 - 0.35, TOP_Y - 0.16, (TOP_D - FRAME) / 2 + 0.1]}
          titulo="Travamento"
          texto="Moldura perimetral que trava as pranchas e impede o tampo de empenar. Cantos chanfrados e selados com óleo fosco."
        />
      </ExplodingPiece>
      <ExplodingPiece
        exploded={exploded}
        instant={instant}
        explode={[-OUT * 1.5, LIFT * 0.55, 0]}
      >
        <Piece
          size={[FRAME, TOP_T, INNER_D]}
          position={[-(TOP_W - FRAME) / 2, TOP_Y, 0]}
          maps={m0}
          foto={fotoTampo}
          repeat={[1, 1]}
        />
      </ExplodingPiece>
      <ExplodingPiece
        exploded={exploded}
        instant={instant}
        explode={[OUT * 1.5, LIFT * 0.55, 0]}
      >
        <Piece
          size={[FRAME, TOP_T, INNER_D]}
          position={[(TOP_W - FRAME) / 2, TOP_Y, 0]}
          maps={m0}
          foto={fotoTampo}
          tint="#fbf5ec"
          repeat={[1, 1]}
        />
      </ExplodingPiece>

      {/* ---------------- Pés em "U" invertido ---------------- */}
      {[-1, 1].map((sx) => (
        <group key={`pe-${sx}`} position={[sx * FOOT_X, 0, 0]}>
          {[-1, 1].map((sz) => (
            <ExplodingPiece
              key={`montante-${sz}`}
              exploded={exploded}
              instant={instant}
              explode={[sx * 0.12, 0, sz * 0.22]}
            >
              <Piece
                size={[PANEL_T, LEG_H, PANEL_W]}
                position={[0, SOLE_T + LEG_H / 2, sz * FOOT_Z]}
                rotation={[-sz * LEAN, 0, 0]}
                maps={m1}
                foto={fotoPe}
                tint={sz > 0 ? "#f7f0e7" : "#ffffff"}
                repeat={[1, 1.4]}
              />
              {sx > 0 && sz > 0 && (
                <PartLabel
                  visible={exploded}
                  position={[0.3, SOLE_T + LEG_H / 2, sz * FOOT_Z + 0.18]}
                  titulo="Montantes do pé"
                  texto="Painéis maciços de 12 cm fechando um retângulo entre o chão e o tampo, levemente inclinados para dentro."
                />
              )}
            </ExplodingPiece>
          ))}
          {/* barra no chão: é ela que fecha o pé num retângulo, como na peça real */}
          <ExplodingPiece
            exploded={exploded}
            instant={instant}
            explode={[0, -0.16, 0]}
          >
            <Piece
              size={[PANEL_T, SOLE_T, FOOT_Z * 2 + PANEL_W]}
              position={[0, SOLE_T / 2, 0]}
              maps={m2}
              foto={fotoPe}
              tint="#f9f2e9"
              repeat={[1, 1]}
            />
          </ExplodingPiece>

          {/* travessa que fecha o pé contra a face inferior do tampo */}
          <ExplodingPiece
            exploded={exploded}
            instant={instant}
            explode={[0, 0.16, 0]}
          >
            <Piece
              size={[
                PANEL_T + 0.01,
                CROSS_T,
                (FOOT_Z - Math.sin(LEAN) * LEG_H) * 2 + PANEL_W,
              ]}
              position={[0, SOLE_T + LEG_H + CROSS_T / 2, 0]}
              maps={m2}
              foto={fotoPe}
              repeat={[1, 1]}
            />
            {sx < 0 && (
              <PartLabel
                visible={exploded}
                position={[-0.34, SOLE_T + LEG_H + CROSS_T / 2, 0]}
                titulo="Travessa"
                texto="Une os dois montantes por cavilha e cola estrutural — nenhuma ferragem aparece na peça pronta."
              />
            )}
          </ExplodingPiece>
        </group>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hotspots                                                                   */
/* -------------------------------------------------------------------------- */

type Hotspot = {
  id: string;
  label: string;
  text: string;
  position: [number, number, number];
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "tampo",
    label: "Tampo",
    text: "Pranchas de madeira de demolição unidas com friso aparente. Marcas, nós e rachaduras são preservados e selados — cada tampo é único.",
    position: [-0.35, HEIGHT + 0.01 + GROUP_Y, -0.2],
  },
  {
    id: "juncao",
    label: "Junção do pé",
    text: "Pé em “U” invertido com painéis de 12 cm encaixados na travessa. União por cavilha e cola estrutural, sem ferragem aparente.",
    position: [FOOT_X + 0.07, LEG_H + GROUP_Y, FOOT_Z - 0.02],
  },
  {
    id: "borda",
    label: "Borda",
    text: "Canto levemente chanfrado e lixado à mão, com acabamento em óleo fosco que realça o veio sem brilho plástico.",
    position: [-(TOP_W / 2) - 0.02, TOP_Y + GROUP_Y, 0.32],
  },
];

function Hotspots({
  active,
  onSelect,
}: {
  active: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <>
      {HOTSPOTS.map((spot) => (
        <group key={spot.id} position={spot.position}>
          <Html center distanceFactor={2.6} zIndexRange={[20, 0]}>
            <div className="relative">
              <button
                type="button"
                aria-label={`Detalhe: ${spot.label}`}
                aria-expanded={active === spot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(active === spot.id ? null : spot.id);
                }}
                className={`grid h-6 w-6 place-items-center rounded-full border transition ${
                  active === spot.id
                    ? "border-dourado bg-dourado text-grafite"
                    : "border-dourado/70 bg-grafite/80 text-dourado hover:bg-dourado hover:text-grafite"
                }`}
              >
                <span className="text-[11px] font-medium leading-none">
                  {active === spot.id ? "−" : "+"}
                </span>
                {active !== spot.id && (
                  <span className="absolute inset-0 animate-ping rounded-full border border-dourado/50 motion-reduce:animate-none" />
                )}
              </button>

              {active === spot.id && (
                <div
                  role="tooltip"
                  className="absolute left-1/2 top-8 w-52 -translate-x-1/2 rounded-md border border-dourado/25 bg-grafite/95 p-3 text-left shadow-xl backdrop-blur"
                >
                  <p className="font-display text-sm tracking-wide text-dourado">
                    {spot.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-areia/80">
                    {spot.text}
                  </p>
                </div>
              )}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ponte imperativa entre a UI (fora do Canvas) e a câmera                     */
/* -------------------------------------------------------------------------- */

export type ViewerApi = {
  zoom: (factor: number) => void;
  reset: () => void;
};

function CameraBridge({
  apiRef,
  controlsRef,
  homeDist,
}: {
  apiRef: React.MutableRefObject<ViewerApi | null>;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  homeDist: number;
}) {
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    apiRef.current = {
      zoom: (factor: number) => {
        const controls = controlsRef.current;
        const target = controls ? controls.target : new THREE.Vector3();
        const dir = camera.position.clone().sub(target);
        const dist = THREE.MathUtils.clamp(
          dir.length() * factor,
          homeDist * MIN_FACTOR,
          homeDist * MAX_FACTOR,
        );
        camera.position.copy(target.clone().add(dir.setLength(dist)));
        controls?.update();
      },
      reset: () => {
        const controls = controlsRef.current;
        controls?.target.set(0, controls.target.y, 0);
        camera.position.copy(DEFAULT_DIR.clone().multiplyScalar(homeDist));
        controls?.update();
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, camera, controlsRef, homeDist]);

  return null;
}

/**
 * Reenquadra a mesa sempre que o canvas muda de tamanho: em telas estreitas
 * a câmera recua o suficiente para os 220 cm caberem no frame.
 */
function FitToViewport({
  controlsRef,
  onHomeDist,
  exploded,
  instant,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  onHomeDist: (dist: number) => void;
  exploded: boolean;
  instant: boolean;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const goal = useRef<number | null>(null);

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

    // enquadra a esfera envolvente pelo menor dos dois campos de visão,
    // assim a mesa cabe em qualquer ângulo da órbita (e em tela estreita).
    // desmontada, a mesa ocupa mais espaço — a câmera recua junto.
    const halfFov = Math.min(vFov, hFov) / 2;
    const radius = FIT_RADIUS * (exploded ? EXPLODED_FIT : 1);
    const dist = radius / Math.sin(halfFov);

    onHomeDist(dist);
    goal.current = dist;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, exploded, onHomeDist]);

  // acompanha o alvo suavemente, para o recuo virar parte da animação
  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const smooth = 1 - Math.pow(0.004, Math.min(delta, 0.1));

    // recentra a órbita na altura das peças
    if (controls) {
      const lookAtY = exploded ? EXPLODED_LOOK_AT : 0;
      if (Math.abs(controls.target.y - lookAtY) > 0.001) {
        controls.target.y = instant
          ? lookAtY
          : THREE.MathUtils.lerp(controls.target.y, lookAtY, smooth);
        controls.update();
      }
    }

    const dist = goal.current;
    if (dist == null) return;

    const target = controls ? controls.target : ZERO;
    const dir = camera.position.clone().sub(target);
    if (dir.lengthSq() < 1e-6) dir.copy(DEFAULT_DIR);

    const current = dir.length();
    if (Math.abs(current - dist) < 0.005) {
      goal.current = null;
      return;
    }

    const next = instant ? dist : THREE.MathUtils.lerp(current, dist, smooth);
    camera.position.copy(target.clone().add(dir.setLength(next)));
    controls?.update();
  });

  return null;
}

/** interrompe o giro automático enquanto o usuário arrasta */
function AutoRotate({
  controlsRef,
  enabled,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  enabled: boolean;
}) {
  useFrame(() => {
    const controls = controlsRef.current;
    if (controls) controls.autoRotate = enabled;
  });
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Cena                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * O preset do drei baixa um .hdr de CDN externo. Se a rede falhar (ou o CDN
 * estiver bloqueado), o erro sobe e derruba o Canvas inteiro — aqui ele fica
 * contido: a mesa continua de pé, só sem o reflexo do ambiente.
 */
class QuietBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    /* silencioso de propósito: é um detalhe cosmético */
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[3.2, 4.5, 2.6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
      />
      {/* preenchimento frio para separar a mesa do fundo grafite */}
      <directionalLight position={[-3, 2, -2.5]} intensity={0.35} color="#cfd8e3" />
    </>
  );
}

export default function MesaViewerScene({
  className = "",
}: {
  className?: string;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const apiRef = useRef<ViewerApi | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [spinWanted, setSpinWanted] = useState(true); // botão "Girar"
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [homeDist, setHomeDist] = useState(FALLBACK_DIST);
  const [exploded, setExploded] = useState(false);

  const maps = useWoodMaps([11, 23, 37, 53]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) setSpinWanted(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  const handleStart = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setDragging(true);
  }, []);

  const handleEnd = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setDragging(false), 1200);
  }, []);

  const autoRotate = spinWanted && !dragging && !reducedMotion;

  const btn =
    "rounded-full border border-dourado/30 bg-grafite/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-areia/85 backdrop-blur transition hover:border-dourado/70 hover:text-dourado focus:outline-none focus-visible:ring-1 focus-visible:ring-dourado/70";

  return (
    <div className={`relative h-[60vh] w-full md:h-[80vh] ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{
          position: DEFAULT_DIR.clone().multiplyScalar(FALLBACK_DIST).toArray(),
          fov: 38,
        }}
        onPointerMissed={() => setActive(null)}
        aria-label="Modelo 3D interativo da mesa de jantar rústica"
      >
        <Lights />
        <Mesa maps={maps} exploded={exploded} instant={reducedMotion} />
        {/* com a mesa desmontada quem explica são as etiquetas das peças */}
        {!exploded && <Hotspots active={active} onSelect={setActive} />}

        <ContactShadows
          position={[0, GROUP_Y + 0.001, 0]}
          opacity={0.62}
          scale={5.2}
          blur={2.6}
          far={1.4}
          resolution={1024}
          color="#000000"
        />

        {/* ambiente isolado: carrega depois e nunca derruba a cena */}
        <QuietBoundary>
          <Suspense fallback={null}>
            <Environment preset="apartment" />
          </Suspense>
        </QuietBoundary>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2 - 0.06}
          minDistance={homeDist * MIN_FACTOR}
          maxDistance={homeDist * MAX_FACTOR}
          autoRotateSpeed={0.5}
          onStart={handleStart}
          onEnd={handleEnd}
        />
        <AutoRotate controlsRef={controlsRef} enabled={autoRotate} />
        <FitToViewport
          controlsRef={controlsRef}
          onHomeDist={setHomeDist}
          exploded={exploded}
          instant={reducedMotion}
        />
        <CameraBridge
          apiRef={apiRef}
          controlsRef={controlsRef}
          homeDist={homeDist}
        />
      </Canvas>

      {/* ------------------------- controles ------------------------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-full border border-dourado/15 bg-grafite/40 p-1.5 backdrop-blur-sm">
          <button
            type="button"
            className={btn}
            aria-pressed={autoRotate}
            onClick={() => {
              setSpinWanted((v) => !v);
              setDragging(false);
            }}
          >
            {autoRotate ? "Pausar" : "Girar"}
          </button>
          <button
            type="button"
            className={`${btn} ${exploded ? "border-dourado/70 text-dourado" : ""}`}
            aria-pressed={exploded}
            onClick={() => {
              setExploded((v) => !v);
              setActive(null);
            }}
          >
            {exploded ? "Montar" : "Desmontar"}
          </button>
          <button
            type="button"
            className={btn}
            aria-label="Aproximar"
            onClick={() => apiRef.current?.zoom(0.85)}
          >
            Zoom +
          </button>
          <button
            type="button"
            className={btn}
            aria-label="Afastar"
            onClick={() => apiRef.current?.zoom(1.18)}
          >
            Zoom −
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => {
              apiRef.current?.reset();
              setActive(null);
            }}
          >
            Resetar vista
          </button>
        </div>
      </div>

      <p className="pointer-events-none absolute inset-x-0 top-4 text-center text-[10px] uppercase tracking-[0.3em] text-areia/35">
        {exploded
          ? "Cada peça mostra do que a mesa é feita · toque em Montar para fechar"
          : "Arraste para girar · toque nos pontos para ver o acabamento"}
      </p>
    </div>
  );
}
