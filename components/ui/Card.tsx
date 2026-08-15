import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Card de peça — o objeto mais importante do site.
 *
 * A foto fica dentro de uma moldura que corta. No hover, a imagem amplia
 * devagar (1,4s) e o veio da madeira aparece. Sem sombra: quem separa o card
 * do fundo é o espaço e a linha em areia.
 */
export function CardPeca({
  nome,
  categoria,
  ficha,
  imagem,
  alt,
  href,
  className,
}: {
  nome: string;
  categoria: string;
  ficha?: string;
  imagem: string;
  alt: string;
  href?: string;
  className?: string;
}) {
  const conteudo = (
    <>
      <div className="moldura-peca relative aspect-4/5 w-full">
        <Image
          src={imagem}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="zoom-madeira object-cover"
        />
      </div>

      <div className="pt-4">
        <p className="text-etiqueta text-nogueira-suave uppercase">
          {categoria}
        </p>
        <h3 className="text-titulo mt-1.5 font-display text-nogueira">
          {nome}
        </h3>
        {ficha && (
          <p className="text-corpo-sm mt-1 text-nogueira-suave">{ficha}</p>
        )}
      </div>
    </>
  );

  const estilo = cn("group block", className);

  return href ? (
    <Link href={href} className={estilo}>
      {conteudo}
    </Link>
  ) : (
    <article className={estilo}>{conteudo}</article>
  );
}

/**
 * Card de conteúdo — texto sobre superfície secundária, separado por linha fina.
 */
export function CardTexto({
  titulo,
  children,
  numero,
  className,
}: {
  titulo: string;
  children: React.ReactNode;
  numero?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-peca border border-linha bg-areia-clara p-6",
        className,
      )}
    >
      {numero && (
        <p className="text-etiqueta text-nogueira-suave uppercase">{numero}</p>
      )}
      <h3 className="text-display-sm mt-2 font-display text-nogueira">
        {titulo}
      </h3>
      <div className="text-corpo-sm mt-3 text-grafite/80">{children}</div>
    </article>
  );
}
