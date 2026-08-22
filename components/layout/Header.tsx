'use client';

import { useEffect, useState } from 'react';
import Logo from '@/components/ui/Logo';
import LiveClock from '@/components/ui/LiveClock';
import MenuOverlay from '@/components/layout/MenuOverlay';
import { useLenis } from '@/components/providers/SmoothScroll';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/** Header fixo: logo à esquerda, relógio ao vivo e botão de menu. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollTo } = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[70] transition-colors duration-500 ease-smooth',
          scrolled ? 'bg-ink/80 backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
          <a
            href="#topo"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0);
            }}
            aria-label={`${site.brand.name} — voltar ao topo`}
            data-cursor="link"
            className="flex items-center gap-3 text-paper transition-colors duration-300 hover:text-accent"
          >
            <Logo className="h-8 w-auto sm:h-9" />
            <span className="hidden font-display text-sm uppercase tracking-[0.2em] sm:block">
              {site.brand.name}
            </span>
          </a>

          <div className="hidden md:block">
            <LiveClock />
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-fullscreen"
            data-cursor="link"
            className="group flex items-center gap-3 font-sans text-xs uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:text-accent"
          >
            Menu
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="block h-px w-7 bg-current transition-transform duration-300 group-hover:translate-x-1" />
              <span className="block h-px w-7 bg-current transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
