"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Revela o conteúdo quando ele entra na tela: sobe alguns pixels e aparece.
 *
 * A checagem é feita na rolagem, comparando a posição do elemento com a
 * altura da janela. É mais simples que um IntersectionObserver e, o que
 * importa mais aqui, é previsível. Além disso há uma rede de segurança:
 * passados três segundos o bloco aparece de qualquer forma, para que uma
 * falha de medição nunca deixe a página em branco.
 *
 * Sob prefers-reduced-motion, aparece imediatamente e sem movimento.
 */
export default function Reveal({
  children,
  atraso = 0,
  className = "",
}: {
  children: ReactNode;
  /** atraso em ms — use para escalonar itens vizinhos */
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisivel(true);
      return;
    }

    let pendente = 0;

    const limpar = () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      window.clearTimeout(rede);
      if (pendente) cancelAnimationFrame(pendente);
    };

    const conferir = () => {
      pendente = 0;
      // aparece quando o topo do bloco cruza 92% da altura da janela
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        setVisivel(true);
        limpar();
      }
    };

    function agendar() {
      if (pendente) return;
      pendente = requestAnimationFrame(conferir);
    }

    const rede = window.setTimeout(() => setVisivel(true), 3000);

    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar, { passive: true });
    conferir();

    return limpar;
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visivel ? 1 : 0,
        transform: visivel ? "none" : "translateY(28px)",
        transition: "opacity 900ms ease-out, transform 900ms ease-out",
        transitionDelay: visivel ? `${atraso}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
