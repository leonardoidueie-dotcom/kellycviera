'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';

type LenisContextValue = {
  lenis: Lenis | null;
  /** Rola suavemente até um seletor (#id) ou posição. Usado pelo menu e pelos CTAs. */
  scrollTo: (target: string | number, offset?: number) => void;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null, scrollTo: () => {} });

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Smooth scroll global (Lenis) sincronizado com o ScrollTrigger do GSAP.
 * Com `prefers-reduced-motion`, o Lenis nem é instanciado: o scroll fica nativo.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenisRef.current = lenis;
    force((n) => n + 1);

    // O ScrollTrigger precisa ser avisado a cada frame do Lenis.
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo = (target: string | number, offset = 0) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.3 });
      return;
    }
    // Fallback sem Lenis (reduced motion ou antes da montagem).
    if (typeof target === 'number') {
      window.scrollTo({ top: target + offset });
      return;
    }
    const el = document.querySelector(target);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
