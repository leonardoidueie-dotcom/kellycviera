"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * Giro 360° feito com fotos reais da mesa.
 *
 * O cliente arrasta e a mesa gira — como é uma sequência de fotografias,
 * o resultado é fotorrealista por construção: é a peça real, no ateliê real.
 *
 * As fotos ficam em /public/mesa-360/ nomeadas frame-01.jpg, frame-02.jpg…
 * Se a primeira não existir, o componente avisa quem o renderizou (onMissing)
 * para que o visualizador 3D entre no lugar.
 */

type MesaSpin360Props = {
  /** quantas fotos existem na pasta */
  frames?: number;
  /** pasta pública onde estão as fotos */
  dir?: string;
  /** extensão dos arquivos */
  ext?: string;
  alt?: string;
  className?: string;
  /** chamado se as fotos não estiverem publicadas ainda */
  onMissing?: () => void;
};

/** frame-01.jpg, frame-02.jpg, … */
function framePath(dir: string, index: number, ext: string) {
  return `${dir}/frame-${String(index + 1).padStart(2, "0")}.${ext}`;
}

export default function MesaSpin360({
  frames = 24,
  dir = "/mesa-360",
  ext = "jpg",
  alt = "Mesa de jantar rústica em madeira maciça, vista giratória de 360 graus",
  className = "",
  onMissing,
}: MesaSpin360Props) {
  const paths = useMemo(
    () => Array.from({ length: frames }, (_, i) => framePath(dir, i, ext)),
    [frames, dir, ext],
  );

  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const drag = useRef<{ x: number; index: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------------------- pré-carregamento das fotos ---------------------- */
  useEffect(() => {
    let cancelled = false;
    let done = 0;

    const images = paths.map((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        done += 1;
        setLoaded(done);
        if (done === paths.length) setReady(true);
      };
      img.onerror = () => {
        if (cancelled) return;
        // sem a primeira foto não há giro nenhum: quem chamou decide o fallback
        if (i === 0) {
          setMissing(true);
          onMissing?.();
        }
      };
      return img;
    });

    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [paths, onMissing]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* ------------------------- giro automático lento ------------------------ */
  useEffect(() => {
    if (!ready || dragging || reducedMotion) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % paths.length),
      140,
    );
    return () => window.clearInterval(id);
  }, [ready, dragging, reducedMotion, paths.length]);

  /* ------------------------------- arrasto -------------------------------- */
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { x: e.clientX, index };
      setDragging(true);
    },
    [index],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const start = drag.current;
      if (!start) return;

      const width = containerRef.current?.clientWidth ?? 1;
      // uma varrida da largura inteira = uma volta completa
      const delta = ((e.clientX - start.x) / width) * paths.length;
      const next = Math.round(start.index - delta) % paths.length;
      setIndex(next < 0 ? next + paths.length : next);
    },
    [paths.length],
  );

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    drag.current = null;
    setDragging(false);
  }, []);

  const step = useCallback(
    (dir: number) =>
      setIndex((i) => (i + dir + paths.length) % paths.length),
    [paths.length],
  );

  if (missing) return null;

  const progress = Math.round((loaded / paths.length) * 100);

  return (
    <div
      ref={containerRef}
      className={`relative h-[60vh] w-full touch-pan-y select-none md:h-[80vh] ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={paths[index]}
        alt={alt}
        draggable={false}
        className={`h-full w-full object-contain transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        } ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      />

      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-px w-40 overflow-hidden bg-areia/10">
              <div
                className="h-full bg-dourado transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-areia/40">
              Carregando a mesa
            </span>
          </div>
        </div>
      )}

      {ready && (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-[10px] uppercase tracking-[0.3em] text-areia/40">
          Arraste para girar a mesa
        </p>
      )}
    </div>
  );
}
