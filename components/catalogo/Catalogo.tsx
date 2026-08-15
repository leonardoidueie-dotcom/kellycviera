"use client";

import { useMemo, useRef, useState } from "react";
import { CardMovel } from "@/components/catalogo/CardMovel";
import { LightboxMovel } from "@/components/catalogo/LightboxMovel";
import { Reveal } from "@/components/ui/Reveal";
import { CATEGORIAS, type Categoria, type Movel } from "@/data/moveis";
import { cn } from "@/lib/utils";

type Filtro = Categoria | "Todas";

export function Catalogo({ moveis }: { moveis: Movel[] }) {
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const [aberta, setAberta] = useState<Movel | null>(null);

  /* Guarda o card de cada peça para devolver o foco quando o lightbox fechar. */
  const cardsRef = useRef(new Map<string, HTMLButtonElement>());

  const contagem = useMemo(() => {
    const mapa = new Map<Filtro, number>([["Todas", moveis.length]]);
    for (const categoria of CATEGORIAS) mapa.set(categoria, 0);
    for (const movel of moveis) {
      mapa.set(movel.categoria, (mapa.get(movel.categoria) ?? 0) + 1);
    }
    return mapa;
  }, [moveis]);

  /* Categoria sem nenhuma peça não vira chip — filtro que não filtra nada
     só ocupa espaço. */
  const filtros: Filtro[] = useMemo(
    () => ["Todas", ...CATEGORIAS.filter((c) => (contagem.get(c) ?? 0) > 0)],
    [contagem],
  );

  const visiveis = useMemo(
    () =>
      filtro === "Todas" ? moveis : moveis.filter((m) => m.categoria === filtro),
    [filtro, moveis],
  );

  const fechar = () => {
    const slug = aberta?.slug;
    setAberta(null);
    if (slug) {
      // Espera o lightbox sair para o foco não ser roubado de volta.
      requestAnimationFrame(() => cardsRef.current.get(slug)?.focus());
    }
  };

  return (
    <>
      {/* Filtros ---------------------------------------------------------- */}
      <div className="mx-auto w-full max-w-7xl px-5 pt-10 md:px-10">
        <h2 className="sr-only">Filtrar por categoria</h2>
        <ul className="flex flex-wrap gap-2">
          {filtros.map((item) => {
            const ativo = filtro === item;
            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => setFiltro(item)}
                  aria-pressed={ativo}
                  className={cn(
                    "text-corpo-sm inline-flex h-11 items-center gap-2 rounded-peca border px-4 transition-colors duration-200 ease-suave",
                    ativo
                      ? "border-nogueira bg-nogueira text-fundo-cal"
                      : "border-linha-controle text-nogueira hover:bg-areia-clara",
                  )}
                >
                  {item}
                  <span
                    className={cn(
                      "text-corpo-sm tabular-nums",
                      ativo ? "text-fundo-cal/75" : "text-nogueira-suave",
                    )}
                  >
                    {contagem.get(item) ?? 0}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Grade ------------------------------------------------------------ */}
      <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <p aria-live="polite" className="sr-only">
          {visiveis.length}{" "}
          {visiveis.length === 1 ? "peça encontrada" : "peças encontradas"}
          {filtro !== "Todas" ? ` em ${filtro}` : ""}.
        </p>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((movel, i) => (
            <Reveal as="li" key={movel.slug} atraso={(i % 3) * 90}>
              <CardMovel
                movel={movel}
                prioridade={i < 3}
                refBotao={(elemento) => {
                  if (elemento) cardsRef.current.set(movel.slug, elemento);
                  else cardsRef.current.delete(movel.slug);
                }}
                aoAbrir={() => setAberta(movel)}
              />
            </Reveal>
          ))}
        </ul>

        {visiveis.length === 0 && (
          <p className="text-corpo text-grafite/75">
            Ainda não temos peça publicada nesta categoria. Chama no WhatsApp que
            a gente faz sob medida.
          </p>
        )}
      </div>

      {aberta && <LightboxMovel movel={aberta} aoFechar={fechar} />}
    </>
  );
}
