'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type Props = {
  mp4?: string;
  webm?: string;
  poster: string;
  /** Texto alternativo — descreve o que o vídeo mostra. */
  label: string;
  className?: string;
  /** Começa a tocar só quando entra na tela (economiza banda). */
  playWhenVisible?: boolean;
  /** Aparece por cima da foto só depois que o vídeo começa a tocar. */
  fadeIn?: boolean;
};

/**
 * VÍDEO DE FUNDO
 * - `muted` + `playsInline` + `autoPlay`: obrigatório para tocar sozinho no iOS.
 * - `preload="none"` e play só quando visível: não atrapalha o LCP.
 * - Com prefers-reduced-motion, o vídeo NÃO toca: fica só o poster.
 * - A ordem das fontes importa: MP4 (H.264) primeiro, porque é o que o
 *   Safari/iPhone entende. Se um arquivo não existir, o navegador pula pro próximo.
 */
export default function BackgroundVideo({
  mp4,
  webm,
  poster,
  label,
  className,
  playWhenVisible = true,
  fadeIn = false,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Reduced motion: nada de vídeo em movimento, fica o poster.
    if (reduced) {
      video.pause();
      return;
    }

    if (!playWhenVisible) {
      void video.play().catch(() => {});
      return;
    }

    const onPlaying = () => setPlaying(true);
    video.addEventListener('playing', onPlaying);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener('playing', onPlaying);
    };
  }, [reduced, playWhenVisible]);

  return (
    <video
      ref={ref}
      className={cn(
        'h-full w-full object-cover',
        fadeIn && 'transition-opacity duration-1000 ease-smooth',
        fadeIn && (playing ? 'opacity-100' : 'opacity-0'),
        className,
      )}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      // Alguns navegadores só respeitam o autoplay com o atributo presente.
      autoPlay={!reduced}
    >
      {mp4 && <source src={mp4} type="video/mp4" />}
      {webm && <source src={webm} type="video/webm" />}
    </video>
  );
}
