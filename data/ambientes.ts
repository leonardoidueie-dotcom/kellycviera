/**
 * ============================================================================
 * AMBIENTES — projetos montados
 * ============================================================================
 *
 * Aqui não é peça solta: é o cômodo pronto, com o móvel no lugar dele.
 * A página /ambientes alterna o lado do texto a cada item, então a ordem
 * desta lista é a ordem que aparece na tela.
 *
 * PARA ADICIONAR UM PROJETO
 * 1. Suba a foto do ambiente em /public/images/ambientes/ (horizontal fica
 *    melhor — o bloco é largo).
 * 2. Copie um item abaixo e troque os campos.
 * 3. `pecas` recebe os slugs de data/moveis.ts que aparecem na foto. Serve
 *    para dizer ao cliente o que ele está vendo.
 * ============================================================================
 */

import { moveisPublicados } from "@/data/moveis";

export type Ambiente = {
  id: string;
  slug: string;
  titulo: string;
  /** Onde é: bairro, cidade ou tipo de imóvel. */
  local: string;
  /** A legenda do projeto: 2 a 3 frases sobre o que foi feito ali. */
  legenda: string;
  imagem: { src: string; alt: string };
  /** Slugs das peças de data/moveis.ts que estão na foto. */
  pecas: string[];
};

export const ambientes: Ambiente[] = [
  {
    id: "1",
    slug: "sala-de-estar-integrada",
    titulo: "Sala de estar integrada",
    local: "Apartamento · Belo Horizonte",
    legenda:
      "A cliente queria a sala respirando, sem móvel encostado na parede. Fizemos a mesa de centro em bloco, mais baixa que o padrão, e o duo de laterais para o canto do sofá. Tudo na mesma madeira, para a sala ler como uma coisa só.",
    imagem: {
      src: "/images/ambientes/sala-estar.svg",
      alt: "Sala de estar com sofá claro, mesa de centro em bloco de madeira maciça e duas mesas laterais redondas ao lado",
    },
    pecas: ["mesa-de-centro-bloco", "duo-mesas-laterais-redondas"],
  },
  {
    id: "2",
    slug: "varanda-com-jardim-vertical",
    titulo: "Varanda com jardim vertical",
    local: "Casa · Região metropolitana",
    legenda:
      "Varanda comprida e estreita, daquelas que ninguém sabe o que fazer. Colocamos o banco de encosto ripado rente à parede e o jardim vertical artificial do outro lado, para fechar a vista do vizinho. A madeira levou acabamento de área externa.",
    imagem: {
      src: "/images/ambientes/varanda.svg",
      alt: "Varanda com banco de madeira maciça de encosto ripado, parede de jardim vertical artificial à esquerda e porta de vidro ao fundo",
    },
    pecas: ["banco-poltronas-varanda"],
  },
];

/** Devolve as peças cadastradas que aparecem no ambiente. */
export function pecasDoAmbiente(ambiente: Ambiente) {
  return ambiente.pecas
    .map((slug) => moveisPublicados.find((m) => m.slug === slug))
    .filter((m) => m !== undefined);
}
