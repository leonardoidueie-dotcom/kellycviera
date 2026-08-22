'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { site } from '@/site.config';

/**
 * EASTER EGG — bloco extra depois do "fim" do site.
 * Só aparece para quem rolou até o final: a ilustração entra girando de leve
 * e o texto sobe. Troque a imagem em site.config.ts → easterEgg.image
 */
export default function EasterEgg() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-egg]'),
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        },
      );

      gsap.fromTo(
        el.querySelector('[data-egg-img]'),
        { rotate: -8, scale: 0.9 },
        {
          rotate: 4,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      );

      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      aria-label="Bônus de quem rolou até o fim"
      className="relative overflow-hidden border-t border-paper/10 bg-accent/[0.04] py-24 grain"
    >
      <div className="container-page grid items-center gap-12 md:grid-cols-[1fr_auto]">
        <div>
          <p data-egg className="eyebrow text-accent">
            {site.easterEgg.kicker}
          </p>
          <h2 data-egg className="mt-6 max-w-[16ch] font-display text-huge">
            {site.easterEgg.title}
          </h2>
          <p data-egg className="mt-6 max-w-[48ch] text-base leading-relaxed text-paper/65">
            {site.easterEgg.text}
          </p>
          <a
            data-egg
            href={site.contact.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn btn-solid mt-10"
            data-cursor="link"
          >
            {site.easterEgg.cta}
          </a>
        </div>

        <div data-egg-img className="relative mx-auto h-64 w-64 sm:h-80 sm:w-80">
          <Image
            src={site.easterEgg.image}
            alt={site.easterEgg.alt}
            fill
            loading="lazy"
            sizes="320px"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
