'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/**
 * SHOWREEL — bloco de vídeo em largura cheia.
 * - Toca sozinho, sem som, só quando está na tela (economiza banda e bateria).
 * - Botão de som e botão de pausar, ambos acessíveis pelo teclado.
 * - Com prefers-reduced-motion, fica parado no poster até a pessoa dar play.
 * - Para desligar a seção inteira: site.config.ts → media.showreel.enabled = false
 */
export default function Showreel() {
  const { showreel } = site.media;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    let observer: IntersectionObserver | undefined;
    if (!reduced) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) void video.play().catch(() => {});
          else video.pause();
        },
        { threshold: 0.25 },
      );
      observer.observe(video);
    }

    // Zoom suave no scroll (desligado no reduced motion).
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(
        section.querySelector('[data-showreel-media]'),
        { scale: 1.08 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      ScrollTrigger.refresh();
    }, section);

    return () => {
      observer?.disconnect();
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      ctx.revert();
    };
  }, [reduced]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) void video.play().catch(() => {});
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  if (!showreel.enabled) return null;

  return (
    <section
      ref={sectionRef}
      id="showreel"
      aria-labelledby="showreel-titulo"
      className="relative overflow-hidden border-b border-paper/10 py-20 sm:py-28"
    >
      <div className="container-page mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4 text-accent">{showreel.kicker}</p>
          <h2 id="showreel-titulo" className="max-w-[18ch] font-display text-big">
            {showreel.title}
          </h2>
        </div>
        <p className="max-w-[30ch] text-sm text-paper/55">{showreel.caption}</p>
      </div>

      <div className="container-page">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm sm:aspect-video">
          <div data-showreel-media className="absolute inset-0">
            {/* Poster otimizado atrás: aparece instantaneamente enquanto o vídeo carrega */}
            <Image
              src={showreel.poster}
              alt={showreel.alt}
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
            <video
              ref={videoRef}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
                playing ? 'opacity-100' : 'opacity-0',
              )}
              poster={showreel.poster}
              muted
              loop
              playsInline
              preload="none"
              aria-label={showreel.alt}
            >
              {showreel.mp4 && <source src={showreel.mp4} type="video/mp4" />}
              {showreel.webm && <source src={showreel.webm} type="video/webm" />}
            </video>
          </div>

          {/* Controles */}
          <div className="absolute bottom-4 right-4 z-10 flex gap-3">
            <button
              type="button"
              onClick={togglePlay}
              data-cursor="link"
              className="rounded-full border border-paper/25 bg-ink/70 px-5 py-3 font-sans text-[0.65rem] uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
            >
              {playing ? '❚❚ Pausar' : '▶ Tocar'}
            </button>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={!muted}
              data-cursor="link"
              className="rounded-full border border-paper/25 bg-ink/70 px-5 py-3 font-sans text-[0.65rem] uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
            >
              {muted ? 'Som off' : 'Som on'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
