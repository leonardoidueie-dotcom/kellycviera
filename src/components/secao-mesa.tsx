"use client";

import { useCallback, useRef, useState } from "react";

import MesaShowcase from "./mesa-showcase";
import PhotoBackdrop from "./photo-backdrop";
import Reveal from "./reveal";

/**
 * A mesa interativa, agora como capítulo do site em vez de abertura.
 *
 * Aqui ela tem função clara: mostrar por dentro uma peça que o visitante já
 * viu em foto. Enquanto ele gira, o ambiente ao fundo sai de foco e escurece,
 * para a atenção ficar na madeira.
 */
export default function SecaoMesa() {
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
      className="relative overflow-hidden border-y border-grafite-borda"
    >
      <PhotoBackdrop
        blur={interagindo ? 18 : 0}
        escurecer={interagindo ? 0.88 : 0.55}
        posicao="center 32%"
        vinheta={interagindo}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-20 md:pt-28">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/80">
            A peça por dentro
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.02] text-areia md:text-6xl">
            Gire a mesa.
            <span className="block text-dourado/90">Depois, desmonte.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-areia/65">
            Mesa de jantar de 220 × 100 cm, tampo em pranchas de demolição com
            travamento nas cabeceiras. Arraste para girar, toque nos pontos para
            ver o acabamento — e use “Desmontar” para ver como ela é construída,
            peça por peça.
          </p>
        </Reveal>
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
