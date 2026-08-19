"use client";

import { useEffect, useState } from "react";

import { linkWhatsApp, loja, produtos, type Produto } from "@/lib/loja";
import PhotoBackdrop from "./photo-backdrop";
import Reveal from "./reveal";

/** Foto do produto que se vira sozinha caso o arquivo ainda não exista. */
function FotoProduto({ src, alt }: { src?: string; alt: string }) {
  const [quebrou, setQuebrou] = useState(false);

  if (!src || quebrou) {
    return (
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-casca/40 to-grafite-claro">
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
      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
    />
  );
}

/** Foto aberta em tela cheia, para a madeira ser vista de perto. */
function Lightbox({
  produto,
  onFechar,
}: {
  produto: Produto | null;
  onFechar: () => void;
}) {
  useEffect(() => {
    if (!produto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [produto, onFechar]);

  if (!produto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={produto.nome}
      onClick={onFechar}
      className="fixed inset-0 z-[60] grid place-items-center bg-grafite/95 p-4 backdrop-blur-sm md:p-10"
    >
      <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar"
        className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-dourado/40 text-lg text-dourado transition hover:bg-dourado hover:text-grafite"
      >
        ×
      </button>

      <figure
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-4xl overflow-hidden rounded-lg border border-grafite-borda"
      >
        {produto.video ? (
          <video
            src={produto.video}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="max-h-[75vh] w-full bg-black object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.foto}
            alt={produto.nome}
            className="max-h-[75vh] w-full bg-black object-contain"
          />
        )}

        <figcaption className="flex flex-wrap items-center justify-between gap-4 bg-grafite-claro px-5 py-4">
          <div>
            <p className="font-display text-xl text-areia">{produto.nome}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-areia/40">
              {produto.medidas}
            </p>
          </div>
          <a
            href={linkWhatsApp(
              `Olá! Vi a ${produto.nome} (${produto.medidas}) no site da ${loja.nome} e gostaria de um orçamento.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-dourado px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-grafite transition hover:bg-dourado-claro"
          >
            Pedir orçamento
          </a>
        </figcaption>
      </figure>
    </div>
  );
}

function CardProduto({
  produto,
  onAbrir,
}: {
  produto: Produto;
  onAbrir: () => void;
}) {
  const mensagem = `Olá! Vi a ${produto.nome} (${produto.medidas}) no site da ${loja.nome} e gostaria de um orçamento.`;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-grafite-borda bg-grafite-claro/70 backdrop-blur-sm transition-colors duration-500 hover:border-dourado/40"
    >
      <button
        type="button"
        onClick={onAbrir}
        aria-label={`Ver ${produto.nome} em tela cheia`}
        className={`relative block w-full overflow-hidden ${
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

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-grafite via-grafite/5 to-transparent" />

        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-areia/20 bg-grafite/70 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-areia/60 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
          ampliar
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl text-areia md:text-2xl">
            {produto.nome}
          </h3>
          <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-dourado/80">
            {produto.preco ?? "sob consulta"}
          </span>
        </div>

        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-areia/35">
          {produto.medidas}
        </p>

        {/* filete dourado que cresce ao passar o mouse */}
        <span className="mt-4 block h-px w-10 bg-dourado/50 transition-all duration-700 group-hover:w-full group-hover:bg-dourado/80" />

        <p className="mt-4 flex-1 text-sm leading-relaxed text-areia/60">
          {produto.descricao}
        </p>

        <a
          href={linkWhatsApp(mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-dourado/40 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-dourado transition hover:bg-dourado hover:text-grafite"
        >
          Pedir orçamento
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}

export default function Catalogo() {
  const [aberto, setAberto] = useState<Produto | null>(null);

  return (
    <section
      id="catalogo"
      className="relative overflow-hidden border-y border-grafite-borda"
    >
      <PhotoBackdrop
        fontes={["/fotos/loja.jpg", "/fotos/ambiente-cozinha.png"]}
        blur={26}
        escurecer={0.9}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
              O que fazemos
            </p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] text-areia md:text-6xl">
              Peças que não se repetem
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-areia/60">
              Cada móvel nasce de uma tábua específica, com o veio, os nós e as
              marcas que aquela madeira trouxe. Todas as medidas abaixo podem
              ser ajustadas ao seu espaço.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {produtos.map((produto, i) => (
            <Reveal
              key={produto.id}
              atraso={(i % 3) * 120}
              className={produto.destaque ? "md:col-span-2 h-full" : "h-full"}

            >
              <CardProduto
                produto={produto}
                onAbrir={() => setAberto(produto)}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox produto={aberto} onFechar={() => setAberto(null)} />
    </section>
  );
}
