'use client';

import WordReveal from '@/components/ui/WordReveal';
import { site } from '@/site.config';

/** POSICIONAMENTO — uma frase só, grande, revelada palavra por palavra no scroll. */
export default function Positioning() {
  return (
    <section className="relative py-28 sm:py-36" aria-label="Posicionamento">
      <div className="container-page grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
        <p className="eyebrow md:pt-6">(01) Posicionamento</p>
        <WordReveal
          as="h2"
          text={site.brand.positioning}
          stagger={0.045}
          className="max-w-[22ch] font-display text-huge"
        />
      </div>
    </section>
  );
}
