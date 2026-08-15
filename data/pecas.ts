/**
 * Catálogo de peças.
 *
 * Por enquanto só o formato e três exemplos para desenhar a /styleguide.
 * As fotos reais do Instagram entram depois em /public/images.
 */

export type Categoria =
  | "Mesa de jantar"
  | "Mesa de centro"
  | "Mesa lateral"
  | "Banco"
  | "Poltrona"
  | "Painel"
  | "Jardim vertical";

export type Peca = {
  slug: string;
  nome: string;
  categoria: Categoria;
  /** Uma linha de ficha técnica: madeira, medida, acabamento. */
  ficha: string;
  descricao: string;
  imagem: string;
  alt: string;
  destaque?: boolean;
};

export const pecas: Peca[] = [
  {
    slug: "mesa-jantar-peroba",
    nome: "Mesa Peroba",
    categoria: "Mesa de jantar",
    ficha: "Peroba de demolição · 2,40 × 1,00 m · óleo natural",
    descricao:
      "Tampo inteiriço com moldura e pé em U. A medida sai do seu espaço, não do nosso catálogo.",
    imagem: "/images/peca-mesa.svg",
    alt: "Mesa de jantar em peroba de demolição com tampo inteiriço",
    destaque: true,
  },
  {
    slug: "banco-sertao",
    nome: "Banco Sertão",
    categoria: "Banco",
    ficha: "Madeira maciça · 1,80 m · encosto ripado",
    descricao:
      "Banco de encosto ripado para varanda e mesa de jantar. Aguenta o dia a dia.",
    imagem: "/images/peca-banco.svg",
    alt: "Banco de madeira maciça com encosto ripado",
  },
  {
    slug: "painel-veio",
    nome: "Painel Veio",
    categoria: "Painel",
    ficha: "Ripado em maciça · sob medida · fixação oculta",
    descricao:
      "Painel ripado de parede inteira. Fechamos a medida na obra, com o marceneiro no local.",
    imagem: "/images/peca-painel.svg",
    alt: "Painel ripado de madeira maciça cobrindo parede",
  },
];
