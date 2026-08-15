import type { Metadata } from "next";
import Image from "next/image";
import { AberturaPagina } from "@/components/layout/AberturaPagina";
import { ButtonLink } from "@/components/ui/Button";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { Reveal } from "@/components/ui/Reveal";
import { linkWhatsApp, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A marcenaria de Kelly Brandão em Minas Gerais: oficina própria, madeira maciça e de demolição, do desenho da peça à instalação na sua casa.",
};

const etapas = [
  {
    numero: "01",
    titulo: "A medida",
    texto:
      "Você manda foto e medida pelo WhatsApp. Se o projeto for grande, a gente vai até o local conferir com trena na mão.",
  },
  {
    numero: "02",
    titulo: "O desenho",
    texto:
      "Você recebe o desenho da peça com madeira, medida e acabamento fechados. Nada é cortado antes de você aprovar.",
  },
  {
    numero: "03",
    titulo: "A oficina",
    texto:
      "A madeira é escolhida tábua por tábua e a peça é feita aqui, do corte ao acabamento.",
  },
  {
    numero: "04",
    titulo: "A entrega",
    texto:
      "Levamos e instalamos. Painel e marcenaria fixa são montados no local pelo marceneiro que fez a peça.",
  },
];

export default function SobrePage() {
  return (
    <>
      <AberturaPagina
        etiqueta="A marcenaria"
        titulo="Apaixonada por marcenaria"
        texto={site.frase}
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-14 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div className="text-corpo-lg space-y-6 text-grafite/85">
            <p>
              A gente é uma marcenaria de {site.regiao}, com oficina própria. Não
              revendemos móvel pronto de fábrica: a peça que sai daqui foi
              cortada, montada e acabada por nós, com a madeira escolhida tábua
              por tábua. Trabalhamos com maciça e com madeira de demolição —
              essa segunda chega marcada pelo tempo, e é justamente a marca que
              faz a peça.
            </p>
            <p>
              Quase tudo o que fazemos é sob medida, porque quase nenhuma casa
              tem o tamanho que o catálogo do shopping supõe. Você chega com a
              medida do seu cômodo e a gente desenha em cima dela. Se a mesa
              precisa de dez centímetros a menos para a cadeira passar, ela sai
              com dez centímetros a menos.
            </p>
            <p>
              Fazemos também jardim vertical artificial, para quem quer verde na
              parede sem a manutenção que planta viva pede. E acompanhamos do
              começo ao fim: quem desenha a peça é quem fabrica, e quem fabrica
              é quem entrega e instala. Se der problema depois, você fala com a
              gente, não com um call center.
            </p>
          </div>

          <Reveal className="relative aspect-4/3 w-full lg:sticky lg:top-28">
            <Image
              src="/images/sobre/oficina.svg"
              alt="Interior da oficina de marcenaria, com bancada de madeira maciça, ferramentas penduradas na parede e tábuas empilhadas"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="rounded-peca object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section
        className="border-y border-linha bg-areia-clara"
        aria-labelledby="processo"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
          <p className="text-etiqueta text-nogueira-suave uppercase">
            Do projeto à entrega
          </p>
          <h2
            id="processo"
            className="text-display-md mt-3 max-w-[20ch] font-display text-nogueira"
          >
            Como a peça chega até você
          </h2>

          <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {etapas.map((etapa, i) => (
              <Reveal as="li" key={etapa.numero} atraso={i * 100}>
                <p className="text-etiqueta text-nogueira-suave uppercase">
                  {etapa.numero}
                </p>
                <h3 className="text-display-sm mt-2 font-display text-nogueira">
                  {etapa.titulo}
                </h3>
                <p className="text-corpo-sm mt-3 text-grafite/80">
                  {etapa.texto}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="max-w-[52ch]">
          <h2 className="text-display-md font-display text-nogueira">
            Vamos conversar sobre a sua peça?
          </h2>
          <p className="text-corpo-lg mt-4 text-grafite/80">
            Chama no WhatsApp. Responde a Kelly ou alguém da oficina — quem
            atende sabe o que está sendo feito lá dentro.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={linkWhatsApp()} tamanho="lg">
              <IconeWhatsApp className="size-5" />
              Falar no WhatsApp
            </ButtonLink>
            <ButtonLink
              href={site.instagram.url}
              variante="contorno"
              tamanho="lg"
            >
              Ver o Instagram
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
