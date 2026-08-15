/**
 * Dados fixos da marca. Um lugar só — nada de repetir telefone ou @ por aí.
 */
export const site = {
  nome: "Kelly Brandão",
  assinatura: "Marcenaria",
  descricaoCurta: "Móveis sob medida em madeira maciça",
  descricao:
    "Marcenaria em Minas Gerais. Mesas, bancos, poltronas e painéis feitos sob medida em madeira maciça e de demolição. Orçamento pelo WhatsApp.",
  frase: "Mais que projetar ambiente. Nós fabricamos ideias.",
  instagram: {
    usuario: "@kellycvieirabrandao",
    url: "https://instagram.com/kellycvieirabrandao",
  },
  whatsapp: {
    // TODO: trocar pelo número real da loja (formato 55DDDNÚMERO).
    numero: "5531000000000",
    mensagemPadrao:
      "Oi, Kelly! Vi o site e quero um orçamento de um móvel sob medida.",
  },
  regiao: "Minas Gerais",
} as const;

/** Monta o link de conversa já com a mensagem escrita. */
export function linkWhatsApp(mensagem: string = site.whatsapp.mensagemPadrao) {
  return `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}
