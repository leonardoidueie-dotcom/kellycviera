'use client';

import Image from 'next/image';
import { useState } from 'react';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/**
 * LOGOS DE CLIENTES — marquee infinito que pausa no hover.
 * A lista é duplicada para o loop não ter emenda visível.
 * Quando tiver os arquivos, preencha `logo` em site.config.ts → clients.
 */
export default function Clients() {
  const [paused, setPaused] = useState(false);
  const loop = [...site.clients, ...site.clients];

  return (
    <section className="border-y border-paper/10 py-16" aria-labelledby="clientes-titulo">
      <div className="container-page mb-10">
        <h2 id="clientes-titulo" className="eyebrow">
          (03) Quem já vestiu a marca
        </h2>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Máscaras laterais para o marquee sumir suavemente nas bordas */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-32" />

        <ul
          className={cn('marquee-track flex w-max items-center gap-14 sm:gap-20', paused && 'is-paused')}
          style={{ ['--marquee-duration' as string]: '42s' }}
        >
          {loop.map((client, index) => (
            <li
              key={`${client.name}-${index}`}
              aria-hidden={index >= site.clients.length}
              className="shrink-0 opacity-55 transition-opacity duration-300 hover:opacity-100"
            >
              {client.logo ? (
                <Image
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                // Placeholder textual — troque por arquivo de logo quando tiver.
                <span className="whitespace-nowrap font-display text-xl uppercase tracking-tight text-paper/80 sm:text-2xl">
                  {client.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
