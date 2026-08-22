'use client';

import { useEffect, useRef, type ElementType } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { cn, splitWords } from '@/lib/utils';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  /** 'load' dispara na montagem (hero); 'scroll' dispara ao entrar na viewport. */
  trigger?: 'load' | 'scroll';
  delay?: number;
  stagger?: number;
  /** Índices das palavras que recebem a cor de destaque. */
  accentWords?: number[];
};

/**
 * REVELAÇÃO PALAVRA POR PALAVRA
 * Cada palavra sobe de baixo com blur e stagger. Com reduced motion,
 * o texto simplesmente aparece — nada se mexe.
 */
export default function WordReveal({
  text,
  as: Tag = 'p',
  className,
  wordClassName,
  trigger = 'scroll',
  delay = 0,
  stagger = 0.075,
  accentWords = [],
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = splitWords(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll('[data-word]');

    if (reduced) {
      gsap.set(targets, { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)' });
      return;
    }

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        targets,
        { yPercent: 120, autoAlpha: 0, filter: 'blur(12px)' },
        {
          yPercent: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'expo.out',
          stagger,
          delay,
          paused: trigger === 'scroll',
        },
      );

      if (trigger === 'scroll') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => tween.play(),
        });
      }
    }, el);

    return () => ctx.revert();
  }, [reduced, trigger, delay, stagger, text]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="reveal-mask">
          <span
            data-word
            className={cn(
              'inline-block pr-[0.24em] will-change-transform',
              accentWords.includes(index) && 'text-accent',
              wordClassName,
            )}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}
