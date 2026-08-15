"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Entrada no scroll: fade + subida de 12px, uma vez só.
 *
 * O respeito a prefers-reduced-motion está no CSS (globals.css): com movimento
 * reduzido, `.revelar` já nasce visível e sem transição, então o atributo que
 * este componente liga não muda nada visualmente.
 */
export function Reveal({
  children,
  atraso = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  /** Atraso em ms, para escalonar itens de uma grade. */
  atraso?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "figure";
}) {
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-visivel={visivel}
      style={atraso ? ({ "--atraso": `${atraso}ms` } as React.CSSProperties) : undefined}
      className={cn("revelar", className)}
    >
      {children}
    </Tag>
  );
}
