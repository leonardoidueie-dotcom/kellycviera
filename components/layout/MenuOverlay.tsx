'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';
import { useFinePointer, useReducedMotion } from '@/lib/hooks';
import { useLenis } from '@/components/providers/SmoothScroll';
import LiveClock from '@/components/ui/LiveClock';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * MENU FULLSCREEN
 * - Abre com máscara animada (clip-path de cima para baixo).
 * - Cada item tem miniatura que aparece no hover, ao lado, seguindo o mouse.
 * - Fecha com ESC, com clique no item ou no botão "Fechar".
 */
export default function MenuOverlay({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const { lenis, scrollTo } = useLenis();

  /* Abertura / fechamento animados ------------------------------------------ */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const links = itemsRef.current?.querySelectorAll('[data-menu-item]') ?? [];
    const ctx = gsap.context(() => {
      if (open) {
        overlay.style.pointerEvents = 'auto';
        if (reduced) {
          gsap.set(overlay, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1 });
          gsap.set(links, { yPercent: 0, autoAlpha: 1 });
          return;
        }
        gsap
          .timeline()
          .set(overlay, { autoAlpha: 1 })
          .fromTo(
            overlay,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' },
          )
          .fromTo(
            links,
            { yPercent: 120, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out' },
            '-=0.35',
          );
      } else {
        if (reduced) {
          gsap.set(overlay, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' });
          overlay.style.pointerEvents = 'none';
          return;
        }
        gsap.to(overlay, {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 0.6,
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.set(overlay, { autoAlpha: 0 });
            overlay.style.pointerEvents = 'none';
          },
        });
      }
    });

    return () => ctx.revert();
  }, [open, reduced]);

  /* Trava o scroll da página enquanto o menu está aberto --------------------- */
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 120);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      lenis?.start();
      document.body.style.overflow = previous;
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis, onClose]);

  /* Miniatura seguindo o cursor --------------------------------------------- */
  useEffect(() => {
    if (!open || !fine || reduced) return;
    const thumb = thumbRef.current;
    if (!thumb) return;

    // Segue apenas o eixo vertical: a miniatura fica ancorada à direita da tela
    // e não passa por cima do texto do menu.
    gsap.set(thumb, { yPercent: -50 });
    const y = gsap.quickTo(thumb, 'y', { duration: 0.6, ease: 'power3' });
    const onMove = (e: MouseEvent) => y(e.clientY);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [open, fine, reduced]);

  const handleNavigate = (href: string) => {
    onClose();
    // Espera a máscara fechar antes de rolar, senão o scroll acontece "por baixo".
    window.setTimeout(() => scrollTo(href, -80), reduced ? 0 : 620);
  };

  return (
    <div
      ref={overlayRef}
      id="menu-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      className="invisible fixed inset-0 z-[80] bg-ink opacity-0 grain"
      style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
    >
      <div className="container-page flex h-full flex-col py-6">
        {/* Topo do menu */}
        <div className="flex items-center justify-between">
          <LiveClock />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            data-cursor="link"
            className="btn !px-5 !py-3"
          >
            Fechar
            <span aria-hidden="true" className="text-accent">
              ✕
            </span>
          </button>
        </div>

        {/* Itens */}
        <nav className="flex flex-1 items-center" aria-label="Navegação principal">
          <ul ref={itemsRef} className="w-full">
            {site.menu.map((item, index) => (
              <li key={item.href} className="overflow-hidden border-b border-paper/10">
                <button
                  data-menu-item
                  data-cursor="link"
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered((current) => (current === index ? null : current))}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered((current) => (current === index ? null : current))}
                  className="group block w-full py-4 text-left"
                >
                  <span
                    className={cn(
                      'flex items-baseline gap-6 transition-opacity duration-300',
                      // as outras linhas perdem opacidade quando uma está em hover
                      hovered !== null && hovered !== index ? 'opacity-30' : 'opacity-100',
                    )}
                  >
                    <span className="eyebrow w-10 shrink-0 text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-huge uppercase transition-colors duration-300 group-hover:text-accent">
                      {item.label}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Rodapé do menu */}
        <div className="flex flex-wrap items-end justify-between gap-4 pt-6">
          <a href={site.contact.instagram} target="_blank" rel="noreferrer" className="link-underline eyebrow">
            {site.contact.instagramLabel}
          </a>
          <a href={site.contact.phoneHref} className="link-underline eyebrow">
            {site.contact.phoneLabel}
          </a>
          <a href={`mailto:${site.contact.email}`} className="link-underline eyebrow">
            {site.contact.email}
          </a>
        </div>
      </div>

      {/* Miniatura que aparece no hover (desktop) */}
      {fine && !reduced && (
        <div
          ref={thumbRef}
          aria-hidden="true"
          className="pointer-events-none fixed right-[6vw] top-0 z-[85] hidden lg:block"
        >
          <div
            className={cn(
              'relative overflow-hidden rounded-sm transition-[opacity,transform] duration-500 ease-smooth',
              hovered !== null ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
            )}
            style={{ width: '18rem', height: '22rem' }}
          >
            {site.menu.map((item, index) => (
              <Image
                key={item.href}
                src={item.image}
                alt=""
                fill
                sizes="288px"
                className={cn(
                  'object-cover transition-opacity duration-300',
                  hovered === index ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
