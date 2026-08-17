"use client";

import { useState } from "react";

import { linkWhatsApp, loja, produtos, type Produto } from "@/lib/loja";

/** Foto do produto que se vira sozinha caso o arquivo ainda não exista. */
function FotoProduto({ src, alt }: { src?: string; alt: string }) {
  const [quebrou, setQuebrou] = useState(false);

  if (!src || quebrou) {
    return (
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#2A231C] to-grafite-claro">
        <span className="px-6 text-center text-[10px] uppercase tracking-[0.3em] text-areia/25">
          foto em breve
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setQuebrou(true)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}

function CardProduto({ produto }: { produto: Produto }) {
  const mensagem = `Olá! Vi a ${produto.nome} (${produto.medidas}) no site da ${loja.nome} e gostaria de um orçamento.`;

  return (
    <article
      className={`group relative overflow-hidden rounded-lg border border-grafite-borda bg-grafite-claro transition-colors hover:border-dourado/40 ${
        produto.destaque ? "md:col-span-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          produto.destaque ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        {produto.video ? (
          <video
            src={produto.video}
            muted
            loop
            playsInline
            preload="metadata"
            onMouseEnter={(e) => e.currentTarget.play().catch(() => undefined)}
            onMouseLeave={(e) => e.currentTarget.pause()}
            className="h-full w-full object-cover"
          />
        ) : (
          <FotoProduto src={produto.foto} alt={produto.nome} />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-grafite via-grafite/10 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl text-areia">{produto.nome}</h3>
          <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-dourado/80">
            {produto.preco ?? "sob consulta"}
          </span>
        </div>

        <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-areia/35">
          {produto.medidas}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-areia/60">
          {produto.descricao}
        </p>

        <a
          href={linkWhatsApp(mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-dourado/40 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-dourado transition hover:bg-dourado hover:text-grafite"
        >
          Pedir orçamento
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}

export default function Catalogo() {
  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
          O que fazemos
        </p>
        <h2 className="mt-3 font-display text-3xl text-areia md:text-5xl">
          Peças que não se repetem
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-areia/60">
          Cada móvel nasce de uma tábua específica, com o veio, os nós e as
          marcas que aquela madeira trouxe. Todas as medidas abaixo podem ser
          ajustadas ao seu espaço.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {produtos.map((produto) => (
          <CardProduto key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
  );
}
