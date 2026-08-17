"use client";

import { useEffect, useState } from "react";

import { linkWhatsApp, loja } from "@/lib/loja";

/** Botão de WhatsApp que acompanha a rolagem, a partir da segunda dobra. */
export default function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <a
      href={linkWhatsApp(`Olá! Vim pelo site da ${loja.nome}.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-dourado px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-grafite shadow-lg transition-all duration-500 hover:bg-dourado-claro ${
        visivel
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      Falar agora
    </a>
  );
}
