import Image from "next/image";
import type { Movel } from "@/data/moveis";

/**
 * Card do catálogo. É um botão, não um link: abre a peça no lightbox sem
 * trocar de página. A foto amplia devagar no hover — assinatura do site.
 */
export function CardMovel({
  movel,
  aoAbrir,
  prioridade = false,
  refBotao,
}: {
  movel: Movel;
  aoAbrir: () => void;
  /** Só nas primeiras da grade: carrega sem lazy para não piscar. */
  prioridade?: boolean;
  refBotao?: (elemento: HTMLButtonElement | null) => void;
}) {
  const capa = movel.imagens[0];

  return (
    <button
      type="button"
      ref={refBotao}
      onClick={aoAbrir}
      className="group block w-full cursor-pointer text-left"
    >
      <div className="moldura-peca relative aspect-4/5 w-full">
        <Image
          src={capa.src}
          alt={capa.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={prioridade}
          loading={prioridade ? undefined : "lazy"}
          className="zoom-madeira object-cover"
        />
      </div>

      <div className="pt-4">
        <p className="text-etiqueta text-nogueira-suave uppercase">
          {movel.categoria}
        </p>
        <h3 className="text-titulo mt-1.5 font-display text-nogueira">
          {movel.nome}
        </h3>
        <p className="text-corpo-sm mt-1 text-grafite/75">{movel.medidas}</p>
        <span className="text-corpo-sm mt-3 inline-block text-nogueira-suave underline decoration-linha-forte underline-offset-[6px] transition-colors duration-200 ease-suave group-hover:decoration-madeira-mel-escuro">
          Ver a peça
        </span>
      </div>
    </button>
  );
}
