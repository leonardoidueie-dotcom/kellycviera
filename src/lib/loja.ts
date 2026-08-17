/**
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  DADOS DA LOJA — é aqui que se muda o conteúdo do site.              │
 * │  Não precisa mexer em mais nenhum arquivo para trocar telefone,      │
 * │  endereço, preços ou a lista de peças.                               │
 * └──────────────────────────────────────────────────────────────────────┘
 */

export const loja = {
  nome: "Tok Rústico",
  chamada: "Móveis em madeira maciça e de demolição",

  /**
   * ⚠️ PREENCHER: número do WhatsApp com código do país e DDD, só dígitos.
   * Exemplo para um celular de São Paulo: "5511987654321"
   */
  whatsapp: "5500000000000",

  /** ⚠️ PREENCHER: usuário do Instagram, sem o @ */
  instagram: "tokrustico",

  /** ⚠️ PREENCHER */
  endereco: "Rua Example, 000 — Bairro, Cidade/UF",
  horario: "Segunda a sexta, 9h às 18h · Sábado, 9h às 13h",

  /** ⚠️ PREENCHER (deixe vazio para esconder do rodapé) */
  email: "",
};

/** Monta o link do WhatsApp já com a mensagem escrita. */
export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export type Produto = {
  id: string;
  nome: string;
  medidas: string;
  descricao: string;
  /** caminho da foto em /public — se o arquivo não existir, o card se vira */
  foto?: string;
  /** vídeo no lugar da foto, quando houver */
  video?: string;
  /** ⚠️ PREENCHER com o preço, ou deixe como está para "sob consulta" */
  preco?: string;
  destaque?: boolean;
};

export const produtos: Produto[] = [
  {
    id: "mesa-jantar",
    nome: "Mesa de jantar rústica",
    medidas: "220 × 100 cm · altura 78 cm",
    descricao:
      "Tampo em pranchas de madeira de demolição com travamento perimetral, sobre pés maciços em retângulo fechado. Acabamento em óleo fosco.",
    foto: "/fotos/mesa-jantar.jpg",
    destaque: true,
  },
  {
    id: "prancha-unica",
    nome: "Mesa prancha única",
    medidas: "255 × 101 cm",
    descricao:
      "Tampo de uma só tábua, com a borda seguindo o contorno original do tronco, sobre base de aço preto. Peça única.",
    video: "/video/prancha-unica.mp4",
    destaque: true,
  },
  {
    id: "mesa-centro",
    nome: "Mesa de centro",
    medidas: "Sob medida",
    descricao:
      "Volume maciço em bloco, com veio contínuo nas quatro faces e base recuada que dá leveza à peça.",
    foto: "/fotos/mesa-centro.png",
  },
  {
    id: "laterais",
    nome: "Mesa de varanda",
    medidas: "Sob medida",
    descricao:
      "Madeira maciça para área externa coberta, com acabamento que aguenta a variação de umidade.",
    foto: "/fotos/mesa-varanda.png",
  },
  {
    id: "bancos",
    nome: "Mesa de família",
    medidas: "Até 12 lugares",
    descricao:
      "Mesas longas para casa de campo e varanda gourmet, com bancos e cadeiras da mesma madeira.",
    foto: "/fotos/ambiente-cozinha.png",
  },
  {
    id: "aparadores",
    nome: "Aparadores e buffets",
    medidas: "Sob medida",
    descricao:
      "Portas em madeira maciça com veio contínuo, sobre base de aço ou pés de madeira.",
    foto: "/fotos/mesa-pequena.png",
  },
];

/** Seções do menu — a ordem aqui é a ordem do menu. */
export const menu = [
  { href: "#mesa-3d", label: "A mesa" },
  { href: "#catalogo", label: "Peças" },
  { href: "#quem-somos", label: "Quem somos" },
  { href: "#orcamento", label: "Orçamento" },
];
