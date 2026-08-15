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
const CROSS_T = 0.14; // travessa superior do "U"
const LEG_H = UNDER_TOP - CROSS_T; // altura dos montantes
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

function WoodMaterial({
  maps,
  tint = "#ffffff",
  repeat = [1, 1],
}: {
  maps: WoodMaps;
  tint?: string;
  repeat?: [number, number];
}) {
  const cloned = useMemo(() => {
    const map = maps.map.clone();
    const bumpMap = maps.bumpMap.clone();
    const roughnessMap = maps.roughnessMap.clone();
    for (const t of [map, bumpMap, roughnessMap]) {
      t.needsUpdate = true;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat[0], repeat[1]);
    }
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, bumpMap, roughnessMap };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps, repeat[0], repeat[1]]);

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
      bumpScale={0.012}
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
  tint?: string;
  repeat?: [number, number];
  radius?: number;
};

function Piece({
  size,
  position,
  rotation = [0, 0, 0],
  maps,
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
      <WoodMaterial maps={maps} tint={tint} repeat={repeat} />
    </RoundedBox>
  );
}

function Mesa({ maps }: { maps: WoodMaps[] }) {
  const [m0, m1, m2, m3] = maps;

  // leve variação de tom entre as pranchas (multiplicador sobre o mel base)
  const tints = ["#ffffff", "#f6efe6", "#fffaf2"];

  return (
    <group position={[0, GROUP_Y, 0]}>
      {/* ---------------- Tampo ---------------- */}
      {/* pranchas longitudinais, levemente rebaixadas para criar os frisos */}
      {PLANK_Z.map((z, i) => (
        <Piece
          key={`prancha-${i}`}
          size={[INNER_W, TOP_T - 0.004, PLANK_D]}
          position={[0, TOP_Y - 0.002, z]}
          maps={maps[i % maps.length]}
          tint={tints[i]}
          repeat={[2.2, 1]}
        />
      ))}

      {/* travamento perimetral: longarinas + cabeceiras */}
      <Piece
        size={[TOP_W, TOP_T, FRAME]}
        position={[0, TOP_Y, -(TOP_D - FRAME) / 2]}
        maps={m3}
        repeat={[2.4, 1]}
      />
      <Piece
        size={[TOP_W, TOP_T, FRAME]}
        position={[0, TOP_Y, (TOP_D - FRAME) / 2]}
        maps={m3}
        tint="#faf3ea"
        repeat={[2.4, 1]}
      />
      <Piece
        size={[FRAME, TOP_T, INNER_D]}
        position={[-(TOP_W - FRAME) / 2, TOP_Y, 0]}
        maps={m0}
        repeat={[1, 1]}
      />
      <Piece
        size={[FRAME, TOP_T, INNER_D]}
        position={[(TOP_W - FRAME) / 2, TOP_Y, 0]}
        maps={m0}
        tint="#fbf5ec"
        repeat={[1, 1]}
      />

      {/* ---------------- Pés em "U" invertido ---------------- */}
      {[-1, 1].map((sx) => (
        <group key={`pe-${sx}`} position={[sx * FOOT_X, 0, 0]}>
          {[-1, 1].map((sz) => (
            <Piece
              key={`montante-${sz}`}
              size={[PANEL_T, LEG_H, PANEL_W]}
              position={[0, LEG_H / 2, sz * FOOT_Z]}
              rotation={[-sz * LEAN, 0, 0]}
              maps={m1}
              tint={sz > 0 ? "#f7f0e7" : "#ffffff"}
              repeat={[1, 1.4]}
            />
          ))}
          {/* travessa que fecha o "U" contra a face inferior do tampo */}
          <Piece
            size={[
              PANEL_T + 0.01,
              CROSS_T,
              (FOOT_Z - Math.sin(LEAN) * LEG_H) * 2 + PANEL_W,
            ]}
            position={[0, LEG_H + CROSS_T / 2, 0]}
            maps={m2}
            repeat={[1, 1]}
          />
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
        controls?.target.set(0, 0, 0);
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
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  onHomeDist: (dist: number) => void;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

    // enquadra a esfera envolvente pelo menor dos dois campos de visão,
    // assim a mesa cabe em qualquer ângulo da órbita (e em tela estreita)
    const halfFov = Math.min(vFov, hFov) / 2;
    const dist = FIT_RADIUS / Math.sin(halfFov);

    onHomeDist(dist);

    const controls = controlsRef.current;
    const target = controls ? controls.target : new THREE.Vector3();
    const dir = camera.position.clone().sub(target);
    if (dir.lengthSq() < 1e-6) dir.copy(DEFAULT_DIR);
    camera.position.copy(target.clone().add(dir.setLength(dist)));
    camera.updateProjectionMatrix();
    controls?.update();
  }, [camera, size.width, size.height, controlsRef, onHomeDist]);

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
        <Mesa maps={maps} />
        <Hotspots active={active} onSelect={setActive} />

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
        <FitToViewport controlsRef={controlsRef} onHomeDist={setHomeDist} />
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
        Arraste para girar · toque nos pontos para ver o acabamento
      </p>
    </div>
  );
}
