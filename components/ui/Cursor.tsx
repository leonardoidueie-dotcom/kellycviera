'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useFinePointer, useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'link' | 'drag' | 'view';

/**
 * CURSOR CUSTOMIZADO
 * - Círculo que segue o mouse com defasagem (quickTo do GSAP).
 * - Cresce e vira cor de destaque sobre links/botões.
 * - Vira seta (← →) sobre áreas de arraste (carrossel de cases).
 * - Desativado no mobile e com prefers-reduced-motion.
 *
 * Como marcar um elemento: `data-cursor="link" | "drag" | "view"`.
 * Também pega <a> e <button> automaticamente.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-custom-cursor');
      return;
    }
    document.documentElement.classList.add('has-custom-cursor');

    const ring = ringRef.current!;
    const dot = dotRef.current!;

    // Centraliza pelo próprio tamanho (o GSAP controla o transform inteiro,
    // por isso a centralização não pode vir de classe utilitária).
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

    // Defasagem: o anel persegue o ponto com atraso maior.
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      setVisible(true);
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const resolveVariant = (target: EventTarget | null): Variant => {
      if (!(target instanceof Element)) return 'default';
      const flagged = target.closest<HTMLElement>('[data-cursor]');
      if (flagged) {
        const value = flagged.dataset.cursor as Variant | undefined;
        if (value === 'link' || value === 'drag' || value === 'view') return value;
      }
      if (target.closest('a, button, input, textarea, select, label, [role="button"]')) return 'link';
      return 'default';
    };

    const onOver = (e: MouseEvent) => setVariant(resolveVariant(e.target));
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      {/* Anel com defasagem */}
      <div
        ref={ringRef}
        className={cn(
          'absolute left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-300 ease-smooth',
          visible ? 'opacity-100' : 'opacity-0',
          variant === 'default' && 'h-9 w-9 border-paper/60 bg-transparent',
          variant === 'link' && 'h-20 w-20 border-accent bg-accent/20',
          variant === 'view' && 'h-24 w-24 border-accent bg-accent/15',
          variant === 'drag' && 'h-24 w-24 border-accent bg-accent/15',
        )}
      >
        {variant === 'drag' && (
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-accent">
            ← arraste →
          </span>
        )}
        {variant === 'view' && (
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-accent">ver</span>
        )}
      </div>

      {/* Ponto central, quase sem atraso */}
      <div
        ref={dotRef}
        className={cn(
          'absolute left-0 top-0 h-1.5 w-1.5 rounded-full transition-opacity duration-300',
          visible && variant === 'default' ? 'opacity-100' : 'opacity-0',
          'bg-accent',
        )}
      />
    </div>
  );
}
