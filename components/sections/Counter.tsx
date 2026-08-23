'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { site } from '@/site.config';
import { formatNumber } from '@/lib/utils';

/**
 * CONTADOR ANIMADO
 * Cada número conta de 0 até o valor final quando entra na viewport.
 * Com reduced motion, o valor final aparece direto.
 * Valores editáveis em site.config.ts → stats.
 */
export default function Counter() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodes = root.querySelectorAll<HTMLElement>('[data-count]');

    if (reduced) {
      nodes.forEach((node) => {
        node.textContent = formatNumber(Number(node.dataset.count));
      });
      return;
    }

    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        const target = Number(node.dataset.count);
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: () => {
            node.textContent = formatNumber(counter.value);
          },
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="numeros"
      className="relative border-b border-paper/10 py-24 sm:py-32"
      aria-labelledby="numeros-titulo"
    >
      <div className="container-page">
        <h2 id="numeros-titulo" className="eyebrow mb-14">
          (02) Números que a rua conferiu
        </h2>

        <dl className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {site.stats.map((stat) => (
            <div key={stat.label} className="border-t border-paper/15 pt-6">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="flex items-baseline font-display text-mega leading-none text-accent">
                  <span data-count={stat.value} className="tabular-nums">
                    0
                  </span>
                  <span aria-hidden="true">{stat.suffix}</span>
                </span>
                <span className="mt-5 block max-w-[24ch] text-sm uppercase tracking-[0.12em] text-paper/60">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
