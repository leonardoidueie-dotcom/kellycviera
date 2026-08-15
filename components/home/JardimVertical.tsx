import Image from "next/image";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { mensagens } from "@/lib/whatsapp";

/**
 * O único bloco em verde folha do site. É aqui que o token ganha o dia — em
 * qualquer outro lugar ele fica de fora.
 */
export function JardimVertical() {
  return (
    <section className="bg-folha text-fundo-cal">
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-0 md:grid-cols-2">
        <div className="relative min-h-[62vw] w-full sm:min-h-[42vw] md:min-h-[30rem]">
          <Image
            src="/images/home/jardim-vertical.svg"
            alt="Parede coberta por jardim vertical artificial, com folhagens em vários tons de verde"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="px-5 py-14 md:px-10 md:py-20 lg:flex lg:flex-col lg:justify-center">
          <p className="text-etiqueta text-fundo-cal/70 uppercase">
            Jardim vertical artificial
          </p>
          <h2 className="text-display-md mt-3 max-w-[16ch] font-display text-fundo-cal">
            Plantas que não precisam regar.
          </h2>
          <p className="text-corpo mt-5 max-w-[44ch] text-fundo-cal/80">
            Verde o ano inteiro, sem terra, sem rega e sem folha caindo no
            chão. Fechamos parede de varanda, de sala e de fachada — a gente
            mede o vão e monta no lugar.
          </p>

          <BotaoWhatsApp
            origem="home-jardim-vertical"
            mensagem={mensagens.jardimVertical}
            className="text-corpo mt-8 inline-flex h-14 w-fit items-center justify-center gap-2 rounded-peca bg-madeira-mel px-7 font-medium text-grafite transition-colors duration-200 ease-suave hover:bg-madeira-mel-claro"
          >
            <IconeWhatsApp className="size-5" />
            Orçar meu jardim vertical
          </BotaoWhatsApp>
        </div>
      </div>
    </section>
  );
}
