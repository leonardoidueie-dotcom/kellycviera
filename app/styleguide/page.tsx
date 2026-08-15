import type { Metadata } from "next";
import Image from "next/image";
import { Button, ButtonLink, classesBotao } from "@/components/ui/Button";
import { CardPeca, CardTexto } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import {
  coresApoio,
  coresBase,
  escalaTipografica,
  movimento,
  raios,
  sombras,
  type Cor,
} from "@/lib/tokens";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { site } from "@/lib/site";
import { moveisPublicados } from "@/data/moveis";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

function Secao({
  numero,
  titulo,
  resumo,
  children,
}: {
  numero: string;
  titulo: string;
  resumo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-linha py-16 md:py-20">
      <header className="mb-10 max-w-[52ch]">
        <p className="text-etiqueta text-nogueira-suave uppercase">{numero}</p>
        <h2 className="text-display-md mt-2 font-display text-nogueira">
          {titulo}
        </h2>
        <p className="text-corpo mt-3 text-grafite/75">{resumo}</p>
      </header>
      {children}
    </section>
  );
}

function Swatch({ cor }: { cor: Cor }) {
  return (
    <div>
      <div
        className={`${cor.classe} flex h-32 items-end rounded-peca border border-linha p-4`}
      >
        {/* O hex vai numa pastilha sólida: por cima da cor crua, tom nenhum
            garantiria AA em todos os swatches. */}
        <span className="text-corpo-sm rounded-mini bg-fundo-cal px-2 py-0.5 font-mono text-grafite">
          {cor.hex}
        </span>
      </div>
      <p className="text-titulo mt-3 font-display text-nogueira">{cor.token}</p>
      <p className="text-corpo-sm mt-1 text-grafite/70">{cor.uso}</p>
      <code className="text-corpo-sm mt-2 inline-block rounded-mini bg-areia-clara px-2 py-0.5 text-nogueira-suave">
        {cor.classe}
      </code>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
      {/* Cabeçalho -------------------------------------------------------- */}
      <header className="py-16 md:py-24">
        <p className="text-etiqueta text-nogueira-suave uppercase">
          {site.nome} {site.assinatura} · Design system
        </p>
        <h1 className="text-display-xl mt-4 max-w-[16ch] font-display text-nogueira">
          {site.frase}
        </h1>
        <p className="text-corpo-lg mt-6 max-w-[58ch] text-grafite/80">
          Esta página é a régua do site. Toda cor, tamanho de texto, raio e
          tempo de transição sai daqui. Se um valor não estiver nesta página,
          ele não entra em componente nenhum.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <BotaoWhatsApp
            origem="styleguide"
            className={classesBotao("solido", "lg")}
          >
            Pedir orçamento no WhatsApp
          </BotaoWhatsApp>
          <ButtonLink
            href={site.instagram.url}
            variante="contorno"
            tamanho="lg"
          >
            Ver o Instagram
          </ButtonLink>
        </div>
      </header>

      {/* 01 — Cores ------------------------------------------------------- */}
      <Secao
        numero="01"
        titulo="Paleta"
        resumo="Seis cores base. O fundo é off-white quente, nunca branco. O mel é a cor das peças e comanda o destaque. O verde folha aparece pouco, e sempre no assunto do jardim vertical."
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {coresBase.map((cor) => (
            <Swatch key={cor.token} cor={cor} />
          ))}
        </div>

        <h3 className="text-display-sm mt-14 font-display text-nogueira">
          Tons de apoio
        </h3>
        <p className="text-corpo-sm mt-2 max-w-[54ch] text-grafite/70">
          Derivados das seis base, só para estado de interface. Não use como
          cor de marca.
        </p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {coresApoio.map((cor) => (
            <Swatch key={cor.token} cor={cor} />
          ))}
        </div>

        <h3 className="text-display-sm mt-14 font-display text-nogueira">
          Combinações que valem
        </h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-peca border border-linha bg-fundo-cal p-6">
            <p className="text-etiqueta text-nogueira-suave uppercase">Padrão</p>
            <p className="text-display-sm mt-2 font-display text-nogueira">
              Nogueira sobre cal
            </p>
            <p className="text-corpo-sm mt-2 text-grafite/75">
              Combinação de 90% do site: título em nogueira, corpo em grafite,
              fundo cal.
            </p>
          </div>
          <div className="rounded-peca bg-grafite p-6">
            <p className="text-etiqueta text-madeira-mel uppercase">Rodapé</p>
            <p className="text-display-sm mt-2 font-display text-fundo-cal">
              Cal sobre grafite
            </p>
            <p className="text-corpo-sm mt-2 text-fundo-cal/70">
              Fecha a página. Destaque em mel continua legível.
            </p>
          </div>
          <div className="rounded-peca bg-folha p-6">
            <p className="text-etiqueta text-fundo-cal/70 uppercase">
              Jardim vertical
            </p>
            <p className="text-display-sm mt-2 font-display text-fundo-cal">
              Cal sobre folha
            </p>
            <p className="text-corpo-sm mt-2 text-fundo-cal/75">
              Um bloco por página. Plantas que não precisam regar.
            </p>
          </div>
        </div>
      </Secao>

      {/* 02 — Tipografia -------------------------------------------------- */}
      <Secao
        numero="02"
        titulo="Tipografia"
        resumo="Fraunces nos títulos e nomes de peça — serifada, com personalidade e tracking levemente negativo. Inter no corpo e na interface. A escala é fechada: não existe tamanho fora desta lista."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-peca border border-linha p-6">
            <p className="text-etiqueta text-nogueira-suave uppercase">Display</p>
            <p className="mt-3 font-display text-display-md text-nogueira">
              Fraunces
            </p>
            <p className="text-corpo-sm mt-2 text-grafite/70">
              Títulos, nomes de peça e números. Carregada por next/font, sem
              chamada externa.{" "}
              <code className="rounded-mini bg-areia-clara px-1.5 py-0.5">
                font-display
              </code>
            </p>
          </div>
          <div className="rounded-peca border border-linha p-6">
            <p className="text-etiqueta text-nogueira-suave uppercase">Corpo</p>
            <p className="mt-3 text-display-md text-nogueira">Inter</p>
            <p className="text-corpo-sm mt-2 text-grafite/70">
              Texto corrido, ficha técnica, botão e menu.{" "}
              <code className="rounded-mini bg-areia-clara px-1.5 py-0.5">
                font-sans
              </code>{" "}
              (padrão do site)
            </p>
          </div>
        </div>

        <ul className="mt-10 divide-y divide-linha border-y border-linha">
          {escalaTipografica.map((tipo) => (
            <li
              key={tipo.token}
              className="grid gap-4 py-7 md:grid-cols-[15rem_1fr] md:gap-10"
            >
              <div>
                <code className="text-corpo-sm rounded-mini bg-areia-clara px-2 py-0.5 text-nogueira">
                  {tipo.classe}
                </code>
                <p className="text-corpo-sm mt-2 text-grafite/70">
                  {tipo.medidas}
                </p>
                <p className="text-corpo-sm mt-1 text-grafite/70">{tipo.uso}</p>
              </div>
              <p
                className={`${tipo.classe} ${
                  tipo.familia === "Fraunces"
                    ? "font-display text-nogueira"
                    : "text-grafite"
                } max-w-[40ch]`}
              >
                {tipo.exemplo}
              </p>
            </li>
          ))}
        </ul>
      </Secao>

      {/* 03 — Botões ------------------------------------------------------ */}
      <Secao
        numero="03"
        titulo="Botões"
        resumo="O site não tem carrinho: tem conversa. O botão sólido em mel é sempre o WhatsApp, e só existe um por bloco. O resto é secundário."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-peca border border-linha p-8">
            <p className="text-etiqueta text-nogueira-suave uppercase">
              Sólido · ação principal
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button tamanho="lg">Pedir orçamento</Button>
              <Button>Pedir orçamento</Button>
              <Button disabled>Enviando…</Button>
            </div>
          </div>

          <div className="rounded-peca border border-linha p-8">
            <p className="text-etiqueta text-nogueira-suave uppercase">
              Contorno · ação secundária
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variante="contorno" tamanho="lg">
                Ver todas as peças
              </Button>
              <Button variante="contorno">Ver todas as peças</Button>
            </div>
          </div>

          <div className="rounded-peca bg-folha p-8">
            <p className="text-etiqueta text-fundo-cal/70 uppercase">
              Folha · só no jardim vertical
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variante="folha" tamanho="lg">
                Conhecer o jardim vertical
              </Button>
            </div>
          </div>

          <div className="rounded-peca border border-linha p-8">
            <p className="text-etiqueta text-nogueira-suave uppercase">
              Texto · navegação dentro do conteúdo
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-6">
              <Button variante="texto">Ver a ficha da peça</Button>
              <Button variante="texto">Como funciona o sob medida</Button>
            </div>
          </div>
        </div>
      </Secao>

      {/* 04 — Cards e o hover assinatura ---------------------------------- */}
      <Secao
        numero="04"
        titulo="Cards"
        resumo="Passe o mouse na foto: a imagem amplia devagar, 1,4 segundo, e o veio da madeira aparece. Essa é a assinatura do site — a textura é o argumento de venda da marcenaria."
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {moveisPublicados.slice(0, 3).map((peca, i) => (
            <Reveal key={peca.slug} atraso={i * 90}>
              <CardPeca
                nome={peca.nome}
                categoria={peca.categoria}
                ficha={peca.medidas}
                imagem={peca.imagens[0].src}
                alt={peca.imagens[0].alt}
              />
            </Reveal>
          ))}
        </div>
        <p className="text-corpo-sm mt-6 text-grafite/70">
          Os cards saem do catálogo de verdade (<code>data/moveis.ts</code>).
          As imagens são desenhos de espera até entrarem as fotos das peças.
        </p>

        <h3 className="text-display-sm mt-14 font-display text-nogueira">
          Card de conteúdo
        </h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <CardTexto numero="01" titulo="Você mostra o espaço">
            Manda a foto e a medida pelo WhatsApp. Se preferir, a gente vai até
            o local.
          </CardTexto>
          <CardTexto numero="02" titulo="A gente desenha">
            Você recebe o desenho da peça com medida, madeira e acabamento
            fechados.
          </CardTexto>
          <CardTexto numero="03" titulo="A oficina fabrica">
            A peça é feita aqui, do corte ao acabamento. Entregamos e
            instalamos.
          </CardTexto>
        </div>
      </Secao>

      {/* 05 — Raio, linha e sombra ---------------------------------------- */}
      <Secao
        numero="05"
        titulo="Raio, linha e sombra"
        resumo="Canto pequeno e consistente, entre 4 e 6px. Sombra quase não existe: o que separa um bloco do outro é o espaço e a linha fina em areia."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {raios.map((raio) => (
            <div key={raio.token} className="rounded-peca border border-linha p-6">
              <div
                className={`${raio.classe} h-20 w-full border border-linha-forte bg-areia-clara`}
              />
              <code className="text-corpo-sm mt-4 inline-block rounded-mini bg-areia-clara px-2 py-0.5 text-nogueira">
                {raio.classe}
              </code>
              <p className="text-corpo-sm mt-2 text-grafite/70">
                {raio.valor} — {raio.uso}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-peca border border-linha p-6">
            <div className="linha-fina mb-4" />
            <p className="text-titulo font-display text-nogueira">
              Linha em areia
            </p>
            <p className="text-corpo-sm mt-2 text-grafite/70">
              O divisor padrão. Use no lugar de sombra sempre que der.
            </p>
            <code className="text-corpo-sm mt-3 inline-block rounded-mini bg-areia-clara px-2 py-0.5 text-nogueira">
              linha-fina
            </code>
          </div>
          {sombras.map((sombra) => (
            <div
              key={sombra.token}
              className={`${sombra.classe} rounded-peca border border-linha bg-fundo-cal p-6`}
            >
              <p className="text-titulo font-display text-nogueira">
                {sombra.token}
              </p>
              <p className="text-corpo-sm mt-2 text-grafite/70">{sombra.uso}</p>
              <code className="text-corpo-sm mt-3 inline-block rounded-mini bg-areia-clara px-2 py-0.5 text-nogueira">
                {sombra.classe}
              </code>
            </div>
          ))}
        </div>
      </Secao>

      {/* 06 — Movimento ---------------------------------------------------- */}
      <Secao
        numero="06"
        titulo="Movimento"
        resumo="Discreto. Blocos entram com fade e 12px de subida quando aparecem na tela, uma vez só. Quem pede movimento reduzido no sistema recebe a página parada, sem perder nada."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-peca border border-linha p-8">
            <p className="text-etiqueta text-nogueira-suave uppercase">
              Entrada no scroll
            </p>
            <div className="mt-5 space-y-3">
              {["Mesas", "Bancos e poltronas", "Painéis"].map((item, i) => (
                <Reveal key={item} atraso={i * 120}>
                  <div className="rounded-mini border border-linha bg-areia-clara px-4 py-3">
                    <span className="text-corpo-sm text-nogueira">{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="text-corpo-sm mt-4 text-grafite/70">
              Componente <code>Reveal</code>, com atraso escalonado por item.
            </p>
          </div>

          <div className="rounded-peca border border-linha p-8">
            <p className="text-etiqueta text-nogueira-suave uppercase">
              Zoom na textura
            </p>
            <div className="moldura-peca relative mt-5 aspect-3/2 w-full">
              <Image
                src="/images/moveis/mesa-centro-02.svg"
                alt="Textura de madeira ampliando devagar no hover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="zoom-madeira object-cover"
              />
            </div>
            <p className="text-corpo-sm mt-4 text-grafite/70">
              <code>moldura-peca</code> corta, <code>zoom-madeira</code> amplia.
              1,4s no <code>ease-madeira</code>.
            </p>
          </div>
        </div>

        <ul className="mt-10 divide-y divide-linha border-y border-linha">
          {movimento.map((token) => (
            <li
              key={token.token}
              className="grid gap-2 py-4 md:grid-cols-[16rem_9rem_1fr] md:gap-8"
            >
              <code className="text-corpo-sm text-nogueira">{token.token}</code>
              <span className="text-corpo-sm text-grafite/70">
                {token.valor}
              </span>
              <span className="text-corpo-sm text-grafite/75">{token.uso}</span>
            </li>
          ))}
        </ul>
      </Secao>

      {/* Rodapé ----------------------------------------------------------- */}
      <footer className="mt-16 rounded-bloco bg-grafite px-8 py-12 md:px-12">
        <p className="text-etiqueta text-madeira-mel uppercase">
          Próximo passo
        </p>
        <p className="text-display-md mt-3 max-w-[22ch] font-display text-fundo-cal">
          Com os tokens de pé, as páginas vêm rápido.
        </p>
        <p className="text-corpo mt-4 max-w-[52ch] text-fundo-cal/70">
          Home, catálogo, página de peça, jardim vertical e contato — todas
          montadas com o que está aqui. Nenhum valor solto.
        </p>
      </footer>
    </main>
  );
}
