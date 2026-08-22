'use client';

import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { useLenis } from '@/components/providers/SmoothScroll';
import { site } from '@/site.config';
import { caseCode } from '@/lib/utils';

type Props = {
  index: number | null;
  /** Retângulo da imagem do card clicado, para a transição contínua. */
  originRect: DOMRect | null;
  onClose: () => void;
};

/**
 * MODAL DE CASE
 * A imagem do card "cresce" até virar a imagem do painel: medimos o retângulo
 * de origem (no card) e o de destino (no modal) e animamos a diferença —
 * a mesma técnica de FLIP, feita à mão para não depender de plugin.
 */
export default function CaseModal({ index, originRect, onClose }: Props) {
  const open = index !== null;
  const item = open ? site.cases[index] : null;

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const reduced = useReducedMotion();
  const { lenis } = useLenis();

  /* Animação de entrada ------------------------------------------------------ */
  useLayoutEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const media = mediaRef.current;
    const inner = innerRef.current;
    if (!overlay || !media || !inner) return;

    if (reduced) {
      gsap.set(overlay, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const target = media.getBoundingClientRect();
      const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });

      tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' });

      if (originRect && target.width > 0) {
        const scaleX = originRect.width / target.width;
        const scaleY = originRect.height / target.height;

        tl.fromTo(
          media,
          {
            x: originRect.left - target.left,
            y: originRect.top - target.top,
            scaleX,
            scaleY,
            transformOrigin: 'top left',
          },
          { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.85 },
          0,
        ).fromTo(
          inner,
          // Contra-escala para a foto não distorcer durante o movimento.
          { scaleX: 1 / scaleX, scaleY: 1 / scaleY, transformOrigin: 'top left' },
          { scaleX: 1, scaleY: 1, duration: 0.85 },
          0,
        );
      }

      tl.fromTo(
        contentRef.current?.children ?? [],
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' },
        0.3,
      );
    }, overlay);

    return () => ctx.revert();
  }, [open, originRect, reduced]);

  /* Trava de scroll, ESC e foco --------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => closeRef.current?.focus(), 100);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      lenis?.start();
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis, onClose]);

  if (!open || !item) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-titulo"
      className="fixed inset-0 z-[90] overflow-y-auto bg-ink"
    >
      <div ref={panelRef} className="min-h-full">
        <div className="container-page flex h-[var(--header-h)] items-center justify-between">
          <p className="eyebrow text-accent">{caseCode(index!)}</p>
          <button ref={closeRef} type="button" onClick={onClose} data-cursor="link" className="btn !px-5 !py-3">
            Fechar <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="container-page grid gap-10 pb-24 lg:grid-cols-2 lg:gap-16">
          {/* Imagem que "cresceu" a partir do card */}
          <div ref={mediaRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <div ref={innerRef} className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div ref={contentRef} className="lg:pt-6">
            <p className="eyebrow mb-5">
              {item.client} · {item.year}
            </p>
            <h2 id="case-modal-titulo" className="font-display text-huge">
              {item.title}
            </h2>
            <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-paper/70">
              {item.description}
            </p>

            <div className="mt-10">
              <p className="eyebrow mb-4">Serviços prestados</p>
              <ul className="flex flex-wrap gap-3">
                {item.services.map((service) => (
                  <li
                    key={service}
                    className="rounded-full border border-accent/40 px-4 py-2 font-sans text-[0.7rem] uppercase tracking-[0.16em] text-accent"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-10 grid gap-5 border-t border-paper/10 pt-8 sm:grid-cols-3">
              {item.results.map((result) => (
                <div key={result}>
                  <dt className="sr-only">Resultado</dt>
                  <dd className="font-display text-lg uppercase leading-tight">{result}</dd>
                </div>
              ))}
            </dl>

            <a
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-solid mt-12"
              data-cursor="link"
            >
              Quero um drop assim
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
