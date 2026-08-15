import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, classesBotao } from "@/components/ui/Button";
import { AberturaPagina } from "@/components/layout/AberturaPagina";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { Reveal } from "@/components/ui/Reveal";
import { ambientes, pecasDoAmbiente } from "@/data/ambientes";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ambientes",
  description:
    "Projetos montados: sala, varanda e jardim vertical artificial. Veja o móvel de madeira maciça no lugar dele, dentro da casa do cliente.",
};

export default function AmbientesPage() {
  return (
    <>
      <AberturaPagina
        etiqueta="Projetos"
        titulo="A peça no lugar dela"
        texto="Foto de peça isolada é uma coisa. Ver o móvel dentro da casa, com o resto do ambiente em volta, é outra. Estes são projetos que já entregamos."
      />

      {/* Cada projeto inverte o lado do texto — a leitura desce em ziguezague. */}
      {ambientes.map((ambiente, i) => {
        const invertido = i % 2 === 1;
        const pecas = pecasDoAmbiente(ambiente);

        return (
          <section
            key={ambiente.slug}
            className="border-b border-linha"
            aria-labelledby={`ambiente-${ambiente.slug}`}
          >
            <div className="mx-auto grid w-full max-w-7xl items-center gap-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              <Reveal
                className={cn(
                  "relative min-h-[64vw] w-full sm:min-h-[48vw] lg:min-h-[34rem]",
                  invertido && "lg:order-2",
                )}
              >
                <Image
                  src={ambiente.imagem.src}
                  alt={ambiente.imagem.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  className="object-cover"
                />
              </Reveal>

              <Reveal
                atraso={120}
                className={cn(
                  "px-5 py-12 md:px-10 md:py-16 lg:py-20",
                  invertido && "lg:order-1",
                )}
              >
                <p className="text-etiqueta text-nogueira-suave uppercase">
                  {ambiente.local}
                </p>
                <h2
                  id={`ambiente-${ambiente.slug}`}
                  className="text-display-md mt-3 max-w-[16ch] font-display text-nogueira"
                >
                  {ambiente.titulo}
                </h2>
                <p className="text-corpo mt-5 max-w-[48ch] text-grafite/80">
                  {ambiente.legenda}
                </p>

                {pecas.length > 0 && (
                  <div className="mt-7">
                    <h3 className="text-etiqueta text-nogueira-suave uppercase">
                      Peças deste projeto
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {pecas.map((peca) => (
                        <li key={peca.slug}>
                          <span className="text-corpo-sm inline-flex rounded-mini border border-linha bg-areia-clara px-3 py-1.5 text-nogueira">
                            {peca.nome}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="max-w-[52ch]">
          <h2 className="text-display-md font-display text-nogueira">
            O seu ambiente é o próximo.
          </h2>
          <p className="text-corpo-lg mt-4 text-grafite/80">
            Manda a foto do cômodo com a medida aproximada. A gente desenha a
            peça no seu espaço antes de qualquer coisa ser cortada.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BotaoWhatsApp
              origem="ambientes-chamada"
              className={classesBotao("solido", "lg")}
            >
              <IconeWhatsApp className="size-5" />
              Falar no WhatsApp
            </BotaoWhatsApp>
            <ButtonLink href="/moveis" variante="contorno" tamanho="lg">
              Ver as peças
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
