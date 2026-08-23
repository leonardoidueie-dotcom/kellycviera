'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { site } from '@/site.config';
import { caseCode } from '@/lib/utils';
import CaseModal from '@/components/sections/CaseModal';

/**
 * CASES EM SCROLL HORIZONTAL
 * - Desktop: a seção é "pinada" e a régua de cards anda na horizontal
 *   conforme a página rola na vertical (ScrollTrigger + scrub).
 * - Mobile / reduced motion: vira um carrossel de swipe nativo com snap.
 * - Clicar no card abre o modal com transição contínua da imagem.
 */
export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Só no desktop e para quem não pediu menos movimento.
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance() + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { x: 0 });
      };
    });

    // Recalcula quando as imagens terminam de carregar.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      mm.revert();
      window.removeEventListener('load', onLoad);
    };
  }, []);

  const openCase = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const media = event.currentTarget.querySelector('[data-case-media]');
    setOriginRect(media ? media.getBoundingClientRect() : null);
    setOpenIndex(index);
  };

  return (
    <>
      <section ref={sectionRef} id="cases" aria-labelledby="cases-titulo" className="relative">
        <div className="flex min-h-[100svh] flex-col justify-center overflow-hidden py-20 lg:py-0">
          <div className="container-page mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 id="cases-titulo" className="font-display text-big">
              Cases
            </h2>
            <p className="eyebrow">
              <span className="hidden lg:inline">Role para o lado ←→</span>
              <span className="lg:hidden">Arraste para o lado ←→</span>
            </p>
          </div>

          <div
            ref={viewportRef}
            data-cursor="drag"
            className="no-scrollbar w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-5 sm:px-8 lg:snap-none lg:overflow-visible lg:px-12"
          >
            <div ref={trackRef} className="flex w-max gap-5 pb-4 sm:gap-8">
              {site.cases.map((item, index) => (
                <article
                  key={item.id}
                  className="w-[78vw] shrink-0 snap-center sm:w-[62vw] lg:w-[30vw] lg:max-w-[26rem]"
                >
                  <button
                    type="button"
                    data-cursor="view"
                    onClick={(event) => openCase(index, event)}
                    aria-label={`Abrir case ${caseCode(index)} — ${item.title}, ${item.client}`}
                    className="group block w-full text-left"
                  >
                    <div
                      data-case-media
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-sm"
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 78vw, 30vw"
                        className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
                        {caseCode(index)}
                      </span>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4 border-t border-paper/15 pt-4">
                      <div>
                        <h3 className="font-display text-xl uppercase transition-colors duration-300 group-hover:text-accent">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-paper/55">
                          {item.client} · {item.year}
                        </p>
                      </div>
                      <span aria-hidden="true" className="text-xl text-paper/30 transition-colors group-hover:text-accent">
                        ↗
                      </span>
                    </div>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.services.map((service) => (
                        <li
                          key={service}
                          className="rounded-full border border-paper/15 px-3 py-1 font-sans text-[0.62rem] uppercase tracking-[0.14em] text-paper/60"
                        >
                          {service}
                        </li>
                      ))}
                    </ul>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CaseModal index={openIndex} originRect={originRect} onClose={() => setOpenIndex(null)} />
    </>
  );
}
