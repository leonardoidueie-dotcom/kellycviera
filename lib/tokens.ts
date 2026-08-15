/**
 * Registro dos tokens do design system.
 *
 * Os valores de verdade vivem em `app/globals.css` (bloco @theme). Este arquivo
 * é o índice legível deles: alimenta a /styleguide e serve de referência de
 * nome na hora de escrever componente. Se um token nasce ou muda no CSS,
 * ele muda aqui também — a /styleguide existe justamente pra denunciar a
 * diferença.
 */

export type Cor = {
  token: string;
  classe: string;
  hex: string;
  uso: string;
};

export const coresBase: Cor[] = [
  {
    token: "fundo-cal",
    classe: "bg-fundo-cal",
    hex: "#F7F4EF",
    uso: "Base do site. Off-white quente, nunca branco puro.",
  },
  {
    token: "madeira-mel",
    classe: "bg-madeira-mel",
    hex: "#C8853F",
    uso: "Cor das peças. Destaque principal: botões, links, detalhes.",
  },
  {
    token: "nogueira",
    classe: "bg-nogueira",
    hex: "#6B4226",
    uso: "Títulos e texto forte.",
  },
  {
    token: "folha",
    classe: "bg-folha",
    hex: "#2F4A3C",
    uso: "Verde profundo do jardim vertical. Com parcimônia — um bloco por página.",
  },
  {
    token: "grafite",
    classe: "bg-grafite",
    hex: "#1C1A17",
    uso: "Rodapé e texto de corpo escuro.",
  },
  {
    token: "areia",
    classe: "bg-areia",
    hex: "#E4DBCD",
    uso: "Bordas, divisórias e superfícies secundárias.",
  },
];

export const coresApoio: Cor[] = [
  {
    token: "madeira-mel-claro",
    classe: "bg-madeira-mel-claro",
    hex: "#D9A05B",
    uso: "Hover do botão sólido — a madeira pegando luz.",
  },
  {
    token: "madeira-mel-escuro",
    classe: "bg-madeira-mel-escuro",
    hex: "#AD6F31",
    uso: "Mel sobre fundo claro: aba ativa e link de destaque.",
  },
  {
    token: "nogueira-suave",
    classe: "bg-nogueira-suave",
    hex: "#82593D",
    uso: "Texto secundário e etiqueta sobre cal e areia-clara (AA 5.56 / 5.01).",
  },
  {
    token: "areia-clara",
    classe: "bg-areia-clara",
    hex: "#EFE8DD",
    uso: "Preenchimento sutil de card sobre o fundo cal.",
  },
  {
    token: "linha-forte",
    classe: "bg-linha-forte",
    hex: "#D3C6B2",
    uso: "Divisória que precisa aparecer um pouco mais.",
  },
  {
    token: "linha-controle",
    classe: "bg-linha-controle",
    hex: "#9E8560",
    uso: "Borda de botão de contorno e campo — 3:1 contra o fundo cal.",
  },
];

export type Tipo = {
  token: string;
  classe: string;
  familia: "Fraunces" | "Inter";
  medidas: string;
  uso: string;
  exemplo: string;
};

export const escalaTipografica: Tipo[] = [
  {
    token: "display-xl",
    classe: "text-display-xl",
    familia: "Fraunces",
    medidas: "clamp(2.75 – 4.5rem) · 1.02 · -0.03em",
    uso: "Título de abertura da home.",
    exemplo: "Nós fabricamos ideias",
  },
  {
    token: "display-lg",
    classe: "text-display-lg",
    familia: "Fraunces",
    medidas: "clamp(2.25 – 3.25rem) · 1.06 · -0.025em",
    uso: "Abertura de página interna.",
    exemplo: "Mesa de jantar em peroba",
  },
  {
    token: "display-md",
    classe: "text-display-md",
    familia: "Fraunces",
    medidas: "clamp(1.75 – 2.375rem) · 1.12 · -0.02em",
    uso: "Título de seção.",
    exemplo: "Peças em madeira maciça",
  },
  {
    token: "display-sm",
    classe: "text-display-sm",
    familia: "Fraunces",
    medidas: "clamp(1.375 – 1.625rem) · 1.2 · -0.018em",
    uso: "Subtítulo e destaque dentro de bloco.",
    exemplo: "Cada peça sai da nossa oficina",
  },
  {
    token: "titulo",
    classe: "text-titulo",
    familia: "Fraunces",
    medidas: "1.125rem · 1.3 · -0.012em",
    uso: "Nome da peça no card.",
    exemplo: "Banco Sertão",
  },
  {
    token: "corpo-lg",
    classe: "text-corpo-lg",
    familia: "Inter",
    medidas: "1.125rem · 1.65",
    uso: "Parágrafo de abertura.",
    exemplo:
      "A madeira chega bruta na oficina. Sai como mesa, banco ou painel — no tamanho da sua casa.",
  },
  {
    token: "corpo",
    classe: "text-corpo",
    familia: "Inter",
    medidas: "1rem · 1.7",
    uso: "Texto padrão do site.",
    exemplo:
      "Trabalhamos com madeira maciça e de demolição. Você escolhe a peça, a gente ajusta a medida.",
  },
  {
    token: "corpo-sm",
    classe: "text-corpo-sm",
    familia: "Inter",
    medidas: "0.875rem · 1.6",
    uso: "Ficha técnica, legenda, texto de apoio.",
    exemplo: "Peroba de demolição · 2,40 × 1,00 m · acabamento em óleo",
  },
  {
    token: "etiqueta",
    classe: "text-etiqueta uppercase",
    familia: "Inter",
    medidas: "0.6875rem · 1.4 · +0.16em · caixa alta",
    uso: "Kicker acima do título e rótulo de categoria.",
    exemplo: "Sob medida",
  },
];

export type Medida = { token: string; classe: string; valor: string; uso: string };

export const raios: Medida[] = [
  {
    token: "mini",
    classe: "rounded-mini",
    valor: "4px",
    uso: "Tag, badge e campo pequeno.",
  },
  {
    token: "peca",
    classe: "rounded-peca",
    valor: "5px",
    uso: "Padrão: card, foto e botão.",
  },
  {
    token: "bloco",
    classe: "rounded-bloco",
    valor: "6px",
    uso: "Bloco grande e faixa de destaque.",
  },
];

export const sombras: Medida[] = [
  {
    token: "sutil",
    classe: "shadow-sutil",
    valor: "0 1px 2px rgb(28 26 23 / 0.05)",
    uso: "Quase invisível. Só onde a linha em areia não resolve.",
  },
  {
    token: "elevado",
    classe: "shadow-elevado",
    valor: "0 8px 24px -12px rgb(28 26 23 / 0.14)",
    uso: "Reservado a menu suspenso e modal.",
  },
];

export const movimento: Medida[] = [
  {
    token: "duracao-toque",
    classe: "var(--duracao-toque)",
    valor: "200ms",
    uso: "Hover de botão e link.",
  },
  {
    token: "duracao-entrada",
    classe: "var(--duracao-entrada)",
    valor: "700ms",
    uso: "Fade + subida de 12px na entrada do scroll.",
  },
  {
    token: "duracao-madeira",
    classe: "var(--duracao-madeira)",
    valor: "1400ms",
    uso: "Zoom lento na foto da peça.",
  },
  {
    token: "ease-suave",
    classe: "ease-suave",
    valor: "cubic-bezier(0.22, 1, 0.36, 1)",
    uso: "Entrada de bloco e transição de interface.",
  },
  {
    token: "ease-madeira",
    classe: "ease-madeira",
    valor: "cubic-bezier(0.33, 0.05, 0.2, 1)",
    uso: "Só no zoom da textura. Começa devagar.",
  },
];
