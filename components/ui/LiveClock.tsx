'use client';

import { useEffect, useState } from 'react';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/**
 * RELÓGIO AO VIVO — "SÃO PAULO, 22.08.26 14:07"
 * Usa o fuso definido em site.config.ts (location.timeZone).
 * Só renderiza depois de montar para não dar mismatch de hidratação.
 */
export default function LiveClock({ className }: { className?: string }) {
  const [stamp, setStamp] = useState<string | null>(null);

  useEffect(() => {
    const tz = site.location.timeZone;

    const format = () => {
      const now = new Date();
      const date = new Intl.DateTimeFormat('pt-BR', {
        timeZone: tz,
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
        .format(now)
        .replace(/\//g, '.');
      const time = new Intl.DateTimeFormat('pt-BR', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);
      setStamp(`${date} ${time}`);
    };

    format();
    const id = window.setInterval(format, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      className={cn('font-sans text-[0.68rem] uppercase tracking-[0.22em] text-paper/60', className)}
      suppressHydrationWarning
    >
      <span className="text-paper/40">{site.location.city}, </span>
      <span aria-live="off" className="tabular-nums">
        {stamp ?? '--.--.-- --:--'}
      </span>
    </p>
  );
}
