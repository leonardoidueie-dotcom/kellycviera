/**
 * ============================================================================
 * CATÁLOGO DE MÓVEIS
 * ============================================================================
 *
 * Este é o único arquivo que precisa ser editado para o catálogo crescer.
 * A página /moveis, os filtros e a contagem por categoria saem todos daqui.
 *
 * ----------------------------------------------------------------------------
 * COMO ADICIONAR UMA PEÇA NOVA
 * ----------------------------------------------------------------------------
 * 1. Suba as fotos em /public/images/moveis/ com nome em minúsculas e hífen
 *    (ex.: aparador-canela-01.jpg). A primeira da lista é a que aparece no
 *    card do catálogo — escolha a melhor.
 * 2. Copie um item do array `moveis` abaixo, cole no fim e troque os campos.
 * 3. `id` e `slug` não podem repetir. O slug entra na URL, então: minúsculo,
 *    sem acento e com hífen.
 * 4. `categoria` só aceita um dos valores de `CATEGORIAS`. Para criar uma
 *    categoria nova, acrescente na constante `CATEGORIAS` logo abaixo — o
 *    filtro da página se atualiza sozinho.
 * 5. `alt` descreve a foto para quem não enxerga e para o Google. Escreva o
 *    que aparece na imagem, não o nome comercial da peça.
 *
 * Para tirar uma peça do ar sem perder o texto, marque `publicada: false`.
 * ============================================================================
 */

export const CATEGORIAS = [
  "Sala",
  "Jantar",
  "Varanda e área externa",
  "Complementos",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export type Imagem = {
  /** Caminho a partir de /public. */
  src: string;
  /** Descrição real do que aparece na foto. */
  alt: string;
};

export type Movel = {
  id: string;
  slug: string;
  nome: string;
  categoria: Categoria;
  /** 2 a 3 frases, na voz da marcenaria falando com o cliente. */
  descricao: string;
  materiais: string;
  /** Texto livre — a medida da peça que está na foto. */
  medidas: string;
  acabamento: string;
  /** A primeira imagem é a capa do card. */
  imagens: Imagem[];
  /** Peça de vitrine: aparece em destaque na home. */
  destaque: boolean;
  /** Deixe false para esconder do site sem apagar o cadastro. */
  publicada?: boolean;
};

export const moveis: Movel[] = [
  {
    id: "1",
    slug: "mesa-de-centro-bloco",
    nome: "Mesa de Centro Bloco",
    categoria: "Sala",
    descricao:
      "Um bloco só de madeira maciça, com a base recuada para a peça parecer que flutua no tapete. O veio corre inteiro pelo tampo — nenhuma emenda no meio do caminho. Fazemos no comprimento que o seu sofá pedir.",
    materiais: "Madeira maciça, tampo de peça única",
    medidas: "1,20 × 0,60 m · 0,35 m de altura",
    acabamento: "Óleo natural, toque fosco",
    imagens: [
      {
        src: "/images/moveis/mesa-centro-01.svg",
        alt: "Mesa de centro retangular em madeira maciça, com tampo espesso de veio aparente e base recuada, sobre tapete na sala",
      },
      {
        src: "/images/moveis/mesa-centro-02.svg",
        alt: "Detalhe do veio da madeira no tampo da mesa de centro",
      },
    ],
    destaque: true,
  },
  {
    id: "2",
    slug: "duo-mesas-laterais-redondas",
    nome: "Duo de Mesas Laterais",
    categoria: "Sala",
    descricao:
      "Duas mesas redondas de alturas diferentes, que encaixam uma sob a outra quando você quer o canto livre. A armação de madeira fica aparente, sem nada escondido. Saem em par, mas a gente ajusta a altura de cada uma.",
    materiais: "Madeira maciça, tampo circular e armação aparente",
    medidas: "Ø 0,45 m · 0,55 m e Ø 0,40 m · 0,45 m de altura",
    acabamento: "Óleo natural, toque fosco",
    imagens: [
      {
        src: "/images/moveis/mesas-laterais-01.svg",
        alt: "Duas mesas laterais redondas de madeira com alturas diferentes, encaixadas uma sob a outra ao lado do sofá",
      },
      {
        src: "/images/moveis/mesas-laterais-02.svg",
        alt: "Detalhe do tampo circular de madeira de uma das mesas laterais",
      },
    ],
    destaque: false,
  },
  {
    id: "3",
    slug: "banco-poltronas-varanda",
    nome: "Banco e Poltronas de Varanda",
    categoria: "Varanda e área externa",
    descricao:
      "Banco de encosto ripado e poltronas de braço largo, feitos para ficar do lado de fora. A madeira maciça aguenta sol e chuva com a manutenção certa, e o ripado deixa a água passar. Montamos o conjunto no tamanho da sua varanda.",
    materiais: "Madeira maciça para área externa, encosto ripado",
    medidas: "Banco 1,80 × 0,60 m · poltronas 0,75 × 0,70 m",
    acabamento: "Óleo para área externa, reaplicação anual",
    imagens: [
      {
        src: "/images/moveis/banco-varanda-01.svg",
        alt: "Banco de madeira maciça com encosto ripado e braços largos, na varanda ao lado de plantas",
      },
      {
        src: "/images/moveis/banco-varanda-02.svg",
        alt: "Detalhe das ripas de madeira do encosto do banco de varanda",
      },
    ],
    destaque: true,
  },
  {
    id: "4",
    slug: "mesa-jantar-8-lugares",
    nome: "Mesa de Jantar 8 Lugares",
    categoria: "Jantar",
    descricao:
      "Tampo espesso com moldura e pé em U fechado, em madeira de demolição — a marca do tempo fica à vista, e é isso que faz a peça. Comporta oito lugares sem apertar ninguém. A medida sai do seu cômodo: a gente vai até lá conferir antes de cortar.",
    materiais: "Madeira de demolição, tampo com moldura e pé em U maciço",
    medidas: "2,40 × 1,00 m · 0,78 m de altura",
    acabamento: "Óleo natural, marcas originais preservadas",
    imagens: [
      {
        src: "/images/moveis/mesa-jantar-01.svg",
        alt: "Mesa de jantar para oito lugares em madeira de demolição, com tampo espesso emoldurado e pé em U fechado",
      },
      {
        src: "/images/moveis/mesa-jantar-02.svg",
        alt: "Detalhe da madeira de demolição do tampo da mesa de jantar, com marcas do tempo",
      },
    ],
    destaque: true,
  },
];

/** Só o que está no ar. É esta lista que a página consome. */
export const moveisPublicados = moveis.filter((m) => m.publicada !== false);

/** Quantas peças por categoria — alimenta a contagem dos chips de filtro. */
export function contarPorCategoria(lista: Movel[] = moveisPublicados) {
  const contagem = new Map<Categoria, number>();
  for (const categoria of CATEGORIAS) contagem.set(categoria, 0);
  for (const movel of lista) {
    contagem.set(movel.categoria, (contagem.get(movel.categoria) ?? 0) + 1);
  }
  return contagem;
}

export function buscarPorSlug(slug: string) {
  return moveisPublicados.find((m) => m.slug === slug);
}
