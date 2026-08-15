import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";

/**
 * Atalho permanente para a conversa. Discreto no desktop (onde o botão do
 * header já está à vista) e maior no mobile, onde é o alvo principal do dedo.
 * Fica abaixo do drawer no empilhamento, para não vazar por cima do menu.
 */
export function BotaoWhatsAppFlutuante() {
  return (
    <BotaoWhatsApp
      origem="botao-flutuante"
      aria-label="Pedir orçamento no WhatsApp"
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-madeira-mel text-grafite shadow-elevado transition-colors duration-200 ease-suave hover:bg-madeira-mel-claro md:right-6 md:bottom-6 md:size-12"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <IconeWhatsApp className="size-7 md:size-6" />
    </BotaoWhatsApp>
  );
}
