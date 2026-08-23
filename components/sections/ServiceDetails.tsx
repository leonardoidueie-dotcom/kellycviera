'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/**
 * DETALHE DE CADA SERVIÇO
 * Blocos alternados (imagem/texto) que entram com fade + subida no scroll.
 * A imagem tem um parallax curto para dar profundidade.
 */
export default function ServiceDetails() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-detail]').forEach((block) => {
        gsap.fromTo(
          block.querySelectorAll('[data-detail-fade]'),
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: block, start: 'top 78%', once: true },
          },
        );

        const media = block.querySelector('[data-detail-media] img');
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -6, scale: 1.1 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: block, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        }
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef} className="border-t border-paper/10">
      {site.services.map((service, index) => (
        <section
          key={service.id}
          id={`detalhe-${service.id}`}
          data-detail
          aria-labelledby={`detalhe-titulo-${service.id}`}
          className="border-b border-paper/10 py-20 sm:py-28"
        >
          <div
            className={cn(
              'container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-20',
              index % 2 === 1 && 'lg:[&>*:first-child]:order-2',
            )}
          >
            <div data-detail-media className="relative aspect-[4/5] w-full overflow-hidden rounded-sm sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src={service.image}
                alt={service.alt}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            <div>
              <p data-detail-fade className="eyebrow mb-6 text-accent">
                ({String(index + 1).padStart(2, '0')}) {site.brand.shortName} serviço
              </p>
              <h3
                id={`detalhe-titulo-${service.id}`}
                data-detail-fade
                className="font-display text-huge"
              >
                {service.title}
              </h3>
              <p data-detail-fade className="mt-6 max-w-[52ch] text-base leading-relaxed text-paper/70">
                {service.description}
              </p>
              <ul data-detail-fade className="mt-8 flex flex-wrap gap-3">
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="rounded-full border border-paper/20 px-4 py-2 font-sans text-[0.7rem] uppercase tracking-[0.16em] text-paper/70"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
