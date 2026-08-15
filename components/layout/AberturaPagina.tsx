import { cn } from "@/lib/utils";

/**
 * Abertura padrão de página interna: etiqueta, título em display e uma linha
 * de contexto. Fecha com a linha fina em areia que separa do conteúdo.
 */
export function AberturaPagina({
  etiqueta,
  titulo,
  texto,
  className,
}: {
  etiqueta: string;
  titulo: string;
  texto?: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mx-auto w-full max-w-7xl border-b border-linha px-5 py-14 md:px-10 md:py-20",
        className,
      )}
    >
      <p className="text-etiqueta text-nogueira-suave uppercase">{etiqueta}</p>
      <h1 className="text-display-lg mt-3 max-w-[20ch] font-display text-nogueira">
        {titulo}
      </h1>
      {texto && (
        <p className="text-corpo-lg mt-5 max-w-[56ch] text-grafite/80">
          {texto}
        </p>
      )}
    </header>
  );
}
