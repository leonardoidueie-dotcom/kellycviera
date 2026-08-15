import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Logotipo em texto: o nome em display, e embaixo a linha fina que diz o que
 * a casa faz. Sem imagem — carrega junto com a fonte e escala em qualquer tela.
 */
export function Logotipo({
  className,
  aoClicar,
}: {
  className?: string;
  aoClicar?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={aoClicar}
      className={cn("group inline-block leading-none", className)}
      aria-label={`${site.nome} — página inicial`}
    >
      <span className="block font-display text-[1.375rem] tracking-[-0.02em] text-nogueira transition-colors duration-200 ease-suave group-hover:text-madeira-mel-escuro md:text-[1.5rem]">
        {site.nome}
      </span>
      <span className="text-etiqueta mt-1 block text-nogueira-suave uppercase">
        Marcenaria e móveis sob medida
      </span>
    </Link>
  );
}
