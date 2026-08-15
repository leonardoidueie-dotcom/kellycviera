import Link from "next/link";
import { cn } from "@/lib/utils";

type Variante = "solido" | "contorno" | "folha" | "texto";
type Tamanho = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-peca font-sans font-medium " +
  "transition-colors duration-200 ease-suave cursor-pointer " +
  "disabled:pointer-events-none disabled:opacity-45";

const variantes: Record<Variante, string> = {
  // Chamada principal do site: falar com a marcenaria.
  solido: "bg-madeira-mel text-fundo-cal hover:bg-madeira-mel-escuro",
  // Ação secundária. Borda em areia, sem peso visual.
  contorno:
    "border border-linha-forte text-nogueira bg-transparent hover:bg-areia-clara",
  // Verde profundo — um por página, no bloco do jardim vertical.
  folha: "bg-folha text-fundo-cal hover:bg-grafite",
  // Link com regra que cresce no hover.
  texto:
    "px-0 text-nogueira underline decoration-linha-forte underline-offset-[6px] " +
    "hover:decoration-madeira-mel",
};

const tamanhos: Record<Tamanho, string> = {
  md: "h-11 px-5 text-corpo-sm",
  lg: "h-13 px-7 text-corpo",
};

type Props = {
  variante?: Variante;
  tamanho?: Tamanho;
  className?: string;
  children: React.ReactNode;
};

function classes(variante: Variante, tamanho: Tamanho, className?: string) {
  return cn(
    base,
    variantes[variante],
    variante === "texto" ? "h-auto" : tamanhos[tamanho],
    className,
  );
}

export function Button({
  variante = "solido",
  tamanho = "md",
  className,
  children,
  ...props
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variante, tamanho, className)} {...props}>
      {children}
    </button>
  );
}

/** Mesma aparência, mas navega. Use para WhatsApp e rotas internas. */
export function ButtonLink({
  variante = "solido",
  tamanho = "md",
  className,
  children,
  href,
  ...props
}: Props &
  Omit<React.ComponentProps<typeof Link>, "className" | "children">) {
  const externo = typeof href === "string" && href.startsWith("http");

  return (
    <Link
      href={href}
      className={classes(variante, tamanho, className)}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </Link>
  );
}
