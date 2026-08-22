'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { useLenis } from '@/components/providers/SmoothScroll';
import WordReveal from '@/components/ui/WordReveal';
import { site } from '@/site.config';

/**
 * HERO
 * - Frase de posicionamento revelada palavra por palavra no load (WordReveal).
 * - Imagem de fundo com parallax lento (ScrollTrigger + scrub).
 * TROQUE a imagem em /public/images/hero.webp (proporção retrato, mín. 1600px de largura).
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollTo } = useLenis();

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg || reduced) return;

    const ctx = gsap.context(() => {
      // Parallax: o fundo anda menos que a página.
      gsap.fromTo(
        bg,
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        },
      );

      gsap.fromTo(
        metaRef.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1, delay: 1.1, ease: 'expo.out' },
      );

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="topo"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-[calc(var(--header-h)+2rem)] grain"
      aria-label="Apresentação"
    >
      {/* Fundo com parallax */}
      <div ref={bgRef} className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.webp"
          alt="Look completo da marca fotografado na rua: camiseta oversized e calça baggy"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/50 to-ink" />
      </div>

      <div className="container-page">
        <p className="eyebrow mb-8 text-accent">
          {site.brand.tagline} — {site.location.city}/{site.location.state} · desde {site.brand.foundedYear}
        </p>

        {/* Frase principal, palavra por palavra, disparada no load */}
        <WordReveal
          as="h1"
          trigger="load"
          delay={0.25}
          text={site.brand.heroLine}
          className="max-w-[18ch] font-display text-mega"
          accentWords={[site.brand.heroLine.split(' ').length - 1]}
        />

        <div
          ref={metaRef}
          className="mt-12 grid gap-8 border-t border-paper/10 pt-8 md:grid-cols-[1.2fr_1fr] md:gap-16"
        >
          <p className="max-w-[52ch] text-base leading-relaxed text-paper/70 sm:text-lg">
            {site.brand.heroSupport}
          </p>

          <div className="flex flex-wrap items-start gap-4 md:justify-end">
            <button
              type="button"
              onClick={() => scrollTo('#servicos', -60)}
              data-cursor="link"
              className="btn btn-solid"
            >
              O que fazemos
              <span aria-hidden="true">↓</span>
            </button>
            <a href={site.contact.whatsappHref} target="_blank" rel="noreferrer" className="btn" data-cursor="link">
              {site.contact.whatsappLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
