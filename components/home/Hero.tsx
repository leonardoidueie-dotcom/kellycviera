import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { linkWhatsApp, site } from "@/lib/site";

/**
 * Abertura do site. A foto ocupa metade da tela no desktop e entra inteira no
 * mobile — o texto fica em fundo sólido, nunca por cima da imagem, para a
 * frase da marca continuar legível em qualquer foto que a Kelly subir depois.
 */
export function Hero() {
  return (
    <section className="border-b border-linha">
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="order-2 px-5 py-14 md:px-10 md:py-20 lg:order-1 lg:flex lg:flex-col lg:justify-center lg:py-24">
          <p className="text-etiqueta text-nogueira-suave uppercase">
            Marcenaria autoral · {site.regiao}
          </p>

          <h1 className="text-display-xl mt-5 max-w-[13ch] font-display text-nogueira">
            {site.frase}
          </h1>

          <p className="text-corpo-lg mt-6 max-w-[46ch] text-grafite/80">
            Madeira maciça e de demolição, cortada na medida do seu espaço.
            Da nossa oficina direto para a sua casa.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/moveis" tamanho="lg">
              Ver os móveis
            </ButtonLink>
            <ButtonLink href={linkWhatsApp()} variante="contorno" tamanho="lg">
              <IconeWhatsApp className="size-5" />
              Falar no WhatsApp
            </ButtonLink>
          </div>
        </div>

        <div className="relative order-1 min-h-[60vw] w-full sm:min-h-[46vw] lg:order-2 lg:min-h-[38rem]">
          <Image
            src="/images/home/hero-jantar.svg"
            alt="Sala de jantar com mesa de oito lugares em madeira de demolição, cadeiras de madeira e luminárias pendentes"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
            className="object-cover object-[center_38%]"
          />
        </div>
      </div>
    </section>
  );
}
