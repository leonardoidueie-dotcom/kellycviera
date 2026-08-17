"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * Giro 360° da mesa controlado pelo arraste, usando um vídeo real da peça.
 *
 * Se o vídeo dá uma volta em torno da mesa, arrastar para o lado avança e
 * retrocede os quadros — o efeito é o de girar a mesa com a mão, e a imagem
 * é fotorrealista porque é filmagem da peça de verdade.
 *
 * Enquanto o visitante não toca, o vídeo roda devagar em loop.
 * Se o arquivo não existir, avisa quem renderizou (onMissing) para o
 * fallback entrar no lugar.
 */

type MesaSpinVideoProps = {
  src?: string;
  className?: string;
  alt?: string;
  /** velocidade do giro automático (1 = velocidade normal do vídeo) */
  velocidade?: number;
  onMissing?: () => void;
};

export default function MesaSpinVideo({
  src = "/video/mesa-360.mp4",
  className = "",
  alt = "Mesa de jantar rústica em madeira maciça — arraste para girar",
  velocidade = 0.5,
  onMissing,
}: MesaSpinVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; time: number } | null>(null);
  const pending = useRef<number | null>(null);

  const [pronto, setPronto] = useState(false);
  const [faltando, setFaltando] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* -------- giro automático enquanto ninguém está interagindo -------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !pronto) return;

    if (arrastando || reducedMotion) {
      video.pause();
      return;
    }

    video.playbackRate = velocidade;
    video.play().catch(() => {
      /* autoplay bloqueado: fica parado, o arraste ainda funciona */
    });
  }, [pronto, arrastando, reducedMotion, velocidade]);

  /* ----------------------------- arraste ----------------------------- */
  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    video.pause();
    drag.current = { x: e.clientX, time: video.currentTime };
    setArrastando(true);
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    const video = videoRef.current;
    if (!start || !video || !video.duration) return;

    const largura = containerRef.current?.clientWidth ?? 1;
    // arrastar a largura inteira da tela = uma volta completa
    const delta = ((e.clientX - start.x) / largura) * video.duration;

    let alvo = (start.time - delta) % video.duration;
    if (alvo < 0) alvo += video.duration;

    // um seek por quadro de tela, senão o navegador engasga
    if (pending.current !== null) cancelAnimationFrame(pending.current);
    pending.current = requestAnimationFrame(() => {
      pending.current = null;
      video.currentTime = alvo;
    });
  }, []);

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    drag.current = null;
    setArrastando(false);
  }, []);

  useEffect(
    () => () => {
      if (pending.current !== null) cancelAnimationFrame(pending.current);
    },
    [],
  );

  const passo = useCallback((segundos: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    let alvo = (video.currentTime + segundos) % video.duration;
    if (alvo < 0) alvo += video.duration;
    video.currentTime = alvo;
  }, []);

  if (faltando) return null;

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
        if (e.key === "ArrowRight") passo(0.2);
        if (e.key === "ArrowLeft") passo(-0.2);
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setPronto(true)}
        onError={() => {
          setFaltando(true);
          onMissing?.();
        }}
        className={`h-full w-full object-contain transition-opacity duration-500 ${
          pronto ? "opacity-100" : "opacity-0"
        } ${arrastando ? "cursor-grabbing" : "cursor-grab"}`}
      />

      {!pronto && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-areia/40">
            Carregando a mesa
          </span>
        </div>
      )}

      {pronto && (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-[10px] uppercase tracking-[0.3em] text-areia/40">
          Arraste para girar a mesa
        </p>
      )}
    </div>
  );
}
