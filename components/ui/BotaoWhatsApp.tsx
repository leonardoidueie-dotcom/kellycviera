"use client";

import {
  linkWhatsApp,
  mensagens,
  registrarCliqueWhatsApp,
  type OrigemWhatsApp,
} from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Todo link de WhatsApp do site sai daqui.
 *
 * Cuida de três coisas que ninguém deveria precisar lembrar em cada botão:
 * abre em nova aba com rel="noopener noreferrer", registra a origem do clique
 * para analytics, e resolve o caso do número não configurado.
 *
 * Sem número, o botão não vira link quebrado: ele aponta para o Instagram da
 * marcenaria, que é onde a Kelly também atende. A conversa continua
 * acontecendo, e o console avisa em desenvolvimento que falta configurar.
 */
export function BotaoWhatsApp({
  origem,
  mensagem = mensagens.geral,
  peca,
  className,
  children,
  ...props
}: {
  origem: OrigemWhatsApp;
  /** Texto que já vai escrito na conversa. Use `mensagens` de lib/whatsapp. */
  mensagem?: string;
  /** Nome da peça, quando o clique parte de uma peça específica. */
  peca?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"a">, "href" | "children">) {
  const link = linkWhatsApp(mensagem);
  const destino = link ?? site.instagram.url;

  const pistaDeDestino = link
    ? "abre a conversa no WhatsApp em nova aba"
    : `abre o Instagram ${site.instagram.usuario} em nova aba`;

  /* Com aria-label, o nome acessível vem só do atributo — o texto escondido
     lá embaixo seria ignorado. Então a pista entra no próprio rótulo. */
  const rotulo = props["aria-label"];

  return (
    <a
      href={destino}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
      {...props}
      {...(rotulo ? { "aria-label": `${rotulo} — ${pistaDeDestino}` } : {})}
      onClick={(evento) => {
        registrarCliqueWhatsApp(origem, peca);
        props.onClick?.(evento);
      }}
    >
      {children}
      {!rotulo && <span className="sr-only"> — {pistaDeDestino}</span>}
    </a>
  );
}
