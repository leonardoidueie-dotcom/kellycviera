/**
 * ============================================================================
 * WHATSAPP — o único lugar do site que monta link de conversa
 * ============================================================================
 *
 * Todo botão de orçamento passa por aqui. Se o número mudar, muda em um lugar
 * só: a variável NEXT_PUBLIC_WHATSAPP_NUMBER (veja .env.example).
 *
 * Nada neste arquivo escreve HTML — quem renderiza é o componente
 * `components/ui/BotaoWhatsApp.tsx`, que também cuida do target, do rel e do
 * evento de analytics.
 * ============================================================================
 */

/** Formato esperado: 55 + DDD + número. Ex.: 5531991234567 */
const FORMATO_VALIDO = /^55\d{10,11}$/;

/**
 * O número, limpo e validado. `null` quando não está configurado ou está
 * malformado — e aí nenhum link é gerado, em vez de gerar um link quebrado.
 */
export function numeroWhatsApp(): string | null {
  const bruto = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const digitos = bruto.replace(/\D/g, "");

  if (digitos === "") {
    avisar(
      "NEXT_PUBLIC_WHATSAPP_NUMBER não está definida — os botões de orçamento vão cair no Instagram até você preencher. Veja .env.example.",
    );
    return null;
  }

  if (!FORMATO_VALIDO.test(digitos)) {
    avisar(
      `NEXT_PUBLIC_WHATSAPP_NUMBER está com "${bruto}", que não bate com o formato 55DDNNNNNNNNN (ex.: 5531991234567). Os botões vão cair no Instagram até corrigir.`,
    );
    return null;
  }

  return digitos;
}

/** Mensagens prontas. O texto que a pessoa vê já escrito ao abrir a conversa. */
export const mensagens = {
  geral: "Olá! Vim pelo site e gostaria de fazer um orçamento.",
  sobMedida: "Olá! Quero um móvel sob medida. Minhas medidas são:",
  jardimVertical: "Olá! Quero saber sobre o jardim vertical.",
  /** Recebe o nome da peça que a pessoa estava olhando. */
  peca: (nome: string) => `Olá! Vi a peça ${nome} no site e queria um orçamento.`,
} as const;

/**
 * Monta o link da conversa. Devolve `null` quando não há número configurado —
 * quem chama decide o que fazer, e nunca sai um href apontando para o vazio.
 */
export function linkWhatsApp(mensagem: string = mensagens.geral): string | null {
  const numero = numeroWhatsApp();
  if (!numero) return null; // quem avisou no console foi numeroWhatsApp()

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * De onde partiu o clique. Serve para a Kelly saber qual peça e qual bloco do
 * site mais puxam conversa. Nome novo aqui = nome novo no relatório.
 */
export type OrigemWhatsApp =
  | "header"
  | "drawer-mobile"
  | "botao-flutuante"
  | "lightbox-peca"
  | "home-hero"
  | "home-jardim-vertical"
  | "home-chamada-final"
  | "ambientes-chamada"
  | "sobre-chamada"
  | "rodape-chamada"
  | "rodape-contato"
  | "styleguide";

export type EventoWhatsApp = {
  event: "clique_whatsapp";
  origem: OrigemWhatsApp;
  /** Só quando o clique saiu de uma peça específica. */
  peca?: string;
  /** false quando o número não está configurado e o clique caiu no plano B. */
  temNumero: boolean;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Empurra o clique para o dataLayer, se houver um (GTM). Sem GTM instalado,
 * o evento aparece no console em desenvolvimento — dá para conferir o
 * rastreamento antes de existir tag manager no ar.
 */
export function registrarCliqueWhatsApp(
  origem: OrigemWhatsApp,
  peca?: string,
): void {
  const evento: EventoWhatsApp = {
    event: "clique_whatsapp",
    origem,
    ...(peca ? { peca } : {}),
    temNumero: numeroWhatsApp() !== null,
  };

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(evento);
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[whatsapp]", evento);
  }
}

/** Avisa no desenvolvimento e fica quieto em produção. */
function avisar(mensagem: string) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[whatsapp] ${mensagem}`);
  }
}
