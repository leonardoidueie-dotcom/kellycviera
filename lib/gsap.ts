'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

/**
 * Registro único do GSAP + ScrollTrigger.
 * Todos os componentes animados importam daqui (nunca direto do pacote),
 * assim o plugin é registrado uma vez só.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
