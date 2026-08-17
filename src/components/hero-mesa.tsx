"use client";

import { useCallback, useRef, useState } from "react";

import { linkWhatsApp, loja } from "@/lib/loja";
import MesaShowcase from "./mesa-showcase";
import PhotoBackdrop from "./photo-backdrop";

/**
 * Topo do site: a foto da loja ao fundo e a mesa interativa na frente.
 *
 * Enquanto o visitante gira a mesa, o fundo se apaga e desfoca mais — a
 * atenção fica na peça. Ao soltar, o ambiente volta.
 */
export default function HeroMesa() {
  const [interagindo, setInteragindo] = useState(false);
  const soltar = useRef<ReturnType<typeof setTimeout> | null>(null);

  const comecou = useCallback(() => {
    if (soltar.current) clearTimeout(soltar.current);
    setInteragindo(true);
  }, []);

  const terminou = useCallback(() => {
    if (soltar.current) clearTimeout(soltar.current);
    soltar.current = setTimeout(() => setInteragindo(false), 900);
  }, []);

  return (
    <section
      id="mesa-3d"
      className="relative overflow-hidden bg-gradient-to-b from-grafite via-grafite-claro to-grafite pt-20"
    >
      <PhotoBackdrop
        blur={interagindo ? 18 : 8}
        escurecer={interagindo ? 0.92 : 0.78}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-10 md:pt-14">
        <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
          {loja.chamada}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-areia md:text-6xl">
          Mesa de jantar rústica
          <span className="block text-dourado/90">220 × 100 cm</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-areia/60">
          Tampo em pranchas de madeira de demolição com travamento nas
          cabeceiras, sobre pés maciços. Gire a peça, aproxime e desmonte para
          ver como ela é feita por dentro.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#catalogo"
            className="rounded-full border border-dourado/50 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-dourado transition hover:bg-dourado hover:text-grafite"
          >
            Ver as peças
          </a>
          <a
            href={linkWhatsApp(
              `Olá! Vi a mesa de jantar rústica 220 × 100 no site da ${loja.nome} e gostaria de um orçamento.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-dourado px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-grafite transition hover:bg-dourado-claro"
          >
            Pedir orçamento
          </a>
        </div>
      </div>

      <div
        className="relative"
        onPointerDown={comecou}
        onPointerUp={terminou}
        onPointerCancel={terminou}
        onPointerLeave={terminou}
      >
        <MesaShowcase />
      </div>
    </section>
  );
}
