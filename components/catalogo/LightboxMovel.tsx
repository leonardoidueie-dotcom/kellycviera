"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import type { Movel } from "@/data/moveis";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { mensagens } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const ID_TITULO = "lightbox-titulo";

/**
 * Lightbox da peça: galeria, ficha e o botão que puxa a conversa.
 *
 * Fecha no Esc e no clique fora, anda na galeria com as setas, trava o scroll
 * do fundo e devolve o foco ao card que abriu — quem navega no teclado não se
 * perde no meio da grade.
 */
export function LightboxMovel({
  movel,
  aoFechar,
}: {
  movel: Movel;
  aoFechar: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const painelRef = useRef<HTMLDivElement>(null);
  const total = movel.imagens.length;

  const anterior = useCallback(
    () => setIndice((i) => (i - 1 + total) % total),
    [total],
  );
  const proxima = useCallback(() => setIndice((i) => (i + 1) % total), [total]);

  useEffect(() => {
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focaveis = () =>
      Array.from(
        painelRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      );

    focaveis()[0]?.focus();

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        aoFechar();
        return;
      }
      if (evento.key === "ArrowLeft" && total > 1) {
        evento.preventDefault();
        anterior();
        return;
      }
      if (evento.key === "ArrowRight" && total > 1) {
        evento.preventDefault();
        proxima();
        return;
      }
      if (evento.key !== "Tab") return;

      const lista = focaveis();
      if (lista.length === 0) return;
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [aoFechar, anterior, proxima, total]);

  const imagem = movel.imagens[indice];

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={-1}
        onClick={aoFechar}
        className="fixed inset-0 -z-10 cursor-default bg-grafite/65 backdrop-blur-sm"
      />

      {/* O painel rola por dentro. Se quem rolasse fosse o container flex, o
          topo do painel ficaria acima da origem do scroll e sairia do alcance
          justamente onde mora o botão de fechar. */}
      <div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ID_TITULO}
        className="relative max-h-[92dvh] w-full max-w-5xl overflow-y-auto rounded-t-bloco border border-linha bg-fundo-cal sm:max-h-[88dvh] sm:rounded-bloco"
      >
        {/* Fica grudado no topo: o X não some quando a ficha é longa. */}
        <div className="sticky top-0 z-10 flex h-0 justify-end">
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="mt-3 mr-3 inline-flex size-11 items-center justify-center rounded-peca border border-linha-controle bg-fundo-cal/95 text-nogueira backdrop-blur-sm transition-colors duration-200 ease-suave hover:bg-areia-clara"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="size-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          {/* Galeria ------------------------------------------------------ */}
          <div className="p-4 md:p-6">
            <div className="moldura-peca relative aspect-4/5 w-full">
              <Image
                key={imagem.src}
                src={imagem.src}
                alt={imagem.alt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={anterior}
                    aria-label="Foto anterior"
                    className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-peca border border-linha bg-fundo-cal/90 text-nogueira transition-colors duration-200 ease-suave hover:bg-fundo-cal"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="size-5"
                    >
                      <path d="M14.5 5L8 12l6.5 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={proxima}
                    aria-label="Próxima foto"
                    className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-peca border border-linha bg-fundo-cal/90 text-nogueira transition-colors duration-200 ease-suave hover:bg-fundo-cal"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="size-5"
                    >
                      <path d="M9.5 5L16 12l-6.5 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {total > 1 && (
              <>
                <ul className="mt-3 flex gap-2">
                  {movel.imagens.map((foto, i) => (
                    <li key={foto.src}>
                      <button
                        type="button"
                        onClick={() => setIndice(i)}
                        aria-label={`Ver foto ${i + 1} de ${total}`}
                        aria-current={i === indice ? "true" : undefined}
                        className={cn(
                          "moldura-peca relative block size-16 border transition-colors duration-200 ease-suave",
                          i === indice
                            ? "border-madeira-mel-escuro"
                            : "border-linha hover:border-linha-controle",
                        )}
                      >
                        <Image
                          src={foto.src}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <p aria-live="polite" className="text-corpo-sm sr-only">
                  Foto {indice + 1} de {total}
                </p>
              </>
            )}
          </div>

          {/* Ficha da peça ------------------------------------------------ */}
          <div className="border-t border-linha p-5 md:border-t-0 md:border-l md:p-8">
            <p className="text-etiqueta text-nogueira-suave uppercase">
              {movel.categoria}
            </p>
            <h2
              id={ID_TITULO}
              className="text-display-md mt-2 font-display text-nogueira"
            >
              {movel.nome}
            </h2>
            <p className="text-corpo mt-4 text-grafite/80">{movel.descricao}</p>

            <dl className="mt-7 divide-y divide-linha border-y border-linha">
              {[
                ["Materiais", movel.materiais],
                ["Medidas", movel.medidas],
                ["Acabamento", movel.acabamento],
              ].map(([rotulo, valor]) => (
                <div key={rotulo} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                  <dt className="text-etiqueta text-nogueira-suave uppercase">
                    {rotulo}
                  </dt>
                  <dd className="text-corpo-sm text-grafite">{valor}</dd>
                </div>
              ))}
            </dl>

            <BotaoWhatsApp
              origem="lightbox-peca"
              peca={movel.nome}
              mensagem={mensagens.peca(movel.nome)}
              className="text-corpo mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-peca bg-madeira-mel px-6 text-center font-medium text-grafite transition-colors duration-200 ease-suave hover:bg-madeira-mel-claro"
            >
              <IconeWhatsApp className="size-5 shrink-0" />
              Pedir orçamento desta peça
            </BotaoWhatsApp>
            <p className="text-corpo-sm mt-3 text-nogueira-suave">
              A medida sai do seu espaço. Manda a foto que a gente ajusta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
