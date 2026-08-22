'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';
import { useFinePointer, useReducedMotion } from '@/lib/hooks';
import { useLenis } from '@/components/providers/SmoothScroll';

/**
 * LISTA DE SERVIÇOS COM HOVER-IMAGE
 * - Linhas grandes em texto; ao passar o mouse, a imagem correspondente flutua
 *   junto do cursor e as outras linhas perdem opacidade.
 * - No mobile (sem hover) cada linha mostra uma miniatura fixa.
 * TROQUE as imagens em site.config.ts → services[].image
 */
export default function Services() {
  const [active, setActive] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const { scrollTo } = useLenis();

  useEffect(() => {
    const el = floatRef.current;
    if (!el || !fine || reduced) return;

    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const x = gsap.quickTo(el, 'x', { duration: 0.75, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.75, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [fine, reduced]);

  return (
    <section id="servicos" className="relative py-24 sm:py-32" aria-labelledby="servicos-titulo">
      <div className="container-page">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-paper/10 pb-6">
          <h2 id="servicos-titulo" className="font-display text-big">
            O que fazemos
          </h2>
          <p className="eyebrow">
            ({String(site.services.length).padStart(2, '0')}) frentes de trabalho
          </p>
        </div>

        <ul
          className="w-full"
          onMouseLeave={() => setActive(null)}
        >
          {site.services.map((service, index) => (
            <li key={service.id} className="border-b border-paper/10">
              <button
                type="button"
                data-cursor="view"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive((current) => (current === index ? null : current))}
                onClick={() => scrollTo(`#detalhe-${service.id}`, -80)}
                aria-label={`${service.title} — ver detalhe`}
                className={cn(
                  'group flex w-full items-center gap-5 py-6 text-left transition-all duration-500 ease-smooth sm:gap-8 sm:py-8',
                  active !== null && active !== index ? 'opacity-30' : 'opacity-100',
                  'hover:pl-2 sm:hover:pl-4',
                )}
              >
                <span className="eyebrow w-10 shrink-0 text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Miniatura fixa só no mobile (não existe hover lá) */}
                <span className="relative block h-16 w-14 shrink-0 overflow-hidden rounded-sm lg:hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-big uppercase transition-colors duration-300 group-hover:text-accent">
                    {service.title}
                  </span>
                  <span className="mt-2 block max-w-[46ch] text-sm text-paper/55">
                    {service.short}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl text-paper/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                >
                  ↗
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Imagem flutuante que segue o cursor (só desktop) */}
      {fine && !reduced && (
        <div
          ref={floatRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[60] hidden lg:block"
        >
          <div
            className={cn(
              'relative h-[24rem] w-[18rem] overflow-hidden rounded-sm transition-[opacity,transform] duration-500 ease-smooth',
              active !== null ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
            )}
          >
            {site.services.map((service, index) => (
              <Image
                key={service.id}
                src={service.image}
                alt=""
                fill
                sizes="288px"
                className={cn(
                  'object-cover transition-opacity duration-300',
                  active === index ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
