"use client";

import { useEffect, useRef, useState } from "react";

type VideoShowcaseProps = {
  src?: string;
  poster?: string;
  titulo?: string;
  legenda?: string;
  className?: string;
  /** vídeo de celular (9/16). false para vídeo deitado (16/9) */
  vertical?: boolean;
};

/**
 * Vídeo da loja em loop silencioso, com controles discretos.
 * Respeita prefers-reduced-motion: não dá autoplay, espera o clique.
 */
export default function VideoShowcase({
  src = "/video/tok-rustico.mp4",
  poster,
  titulo = "A loja por dentro",
  legenda = "Peças em madeira maciça e de demolição, montadas e acabadas à mão.",
  className = "",
  vertical = true,
}: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // só toca quando entra na viewport — evita baixar/rodar fora da tela
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay bloqueado: fica no estado pausado */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  if (failed) return null;

  const btn =
    "rounded-full border border-dourado/30 bg-grafite/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-areia/85 backdrop-blur transition hover:border-dourado/70 hover:text-dourado focus:outline-none focus-visible:ring-1 focus-visible:ring-dourado/70";

  return (
    <figure
      className={`relative mx-auto w-full overflow-hidden rounded-lg border border-grafite-borda bg-grafite-claro ${
        vertical ? "aspect-[9/16] max-w-[420px]" : "aspect-video"
      } ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        controls={false}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        onClick={toggle}
        className="h-full w-full cursor-pointer object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-grafite/80 via-transparent to-transparent" />

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 md:p-5">
        <div>
          <p className="font-display text-xl text-areia">{titulo}</p>
          <p className="mt-1 text-xs leading-relaxed text-areia/60">{legenda}</p>
        </div>

        <div className="pointer-events-auto flex gap-2">
          <button type="button" className={btn} onClick={toggle} aria-pressed={playing}>
            {playing ? "Pausar" : "Reproduzir"}
          </button>
          <button
            type="button"
            className={btn}
            aria-pressed={!muted}
            onClick={() => {
              const video = videoRef.current;
              if (!video) return;
              video.muted = !video.muted;
              setMuted(video.muted);
            }}
          >
            {muted ? "Som" : "Mudo"}
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
