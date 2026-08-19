"use client";

import { useEffect, useState } from "react";

import { linkWhatsApp, loja, menu } from "@/lib/loja";
import Logo from "./logo";

/**
 * Barra fixa no topo: logo, navegação e o botão que leva ao WhatsApp.
 * Fica transparente sobre o topo e ganha fundo quando a página rola.
 */
export default function SiteHeader() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState<string>("");

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // marca no menu a seção que está na tela
  useEffect(() => {
    const alvos = menu
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));

    if (!alvos.length) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setAtivo(`#${visivel.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    alvos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        rolou || aberto
          ? "border-b border-grafite-borda bg-grafite/90 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a href="#topo" className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span className="font-display text-lg tracking-wide text-areia">
            {loja.nome}
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {menu.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative text-[11px] uppercase tracking-[0.2em] transition hover:text-dourado ${
                ativo === item.href ? "text-dourado" : "text-areia/60"
              }`}
            >
              {item.label}
              <span
                aria-hidden
                className={`absolute -bottom-1.5 left-0 h-px bg-dourado transition-all duration-500 ${
                  ativo === item.href ? "w-full" : "w-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={linkWhatsApp(
              `Olá! Vim pelo site da ${loja.nome} e gostaria de falar sobre uma peça.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-dourado/50 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-dourado transition hover:bg-dourado hover:text-grafite sm:block"
          >
            WhatsApp
          </a>

          <button
            type="button"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            onClick={() => setAberto((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-grafite-borda text-areia/70 transition hover:text-dourado md:hidden"
          >
            <span className="text-lg leading-none">{aberto ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="border-t border-grafite-borda md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-2">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className="border-b border-grafite-borda/60 py-3 text-[11px] uppercase tracking-[0.2em] text-areia/70 last:border-0"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
