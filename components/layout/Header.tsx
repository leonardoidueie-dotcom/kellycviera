"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logotipo } from "@/components/layout/Logotipo";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { abaAtiva, abas } from "@/lib/navegacao";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const ID_DRAWER = "menu-mobile";

export function Header() {
  const pathname = usePathname();
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  const botaoMenuRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  /* Fundo translúcido só depois que a página sai do topo. */
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const fechar = useCallback(() => setAberto(false), []);

  /* O drawer fecha ao trocar de página — inclusive no voltar do navegador.
     Ajuste durante a renderização, não em efeito: evita o frame extra com o
     menu aberto por cima da página nova. */
  const [rotaDoDrawer, setRotaDoDrawer] = useState(pathname);
  if (rotaDoDrawer !== pathname) {
    setRotaDoDrawer(pathname);
    if (aberto) setAberto(false);
  }

  /* Enquanto o drawer está aberto: trava o scroll do fundo, Esc fecha e o
     Tab circula dentro do painel. Ao fechar, o foco volta pro botão. */
  useEffect(() => {
    if (!aberto) return;

    const overflowAnterior = document.body.style.overflow;
    const botaoQueAbriu = botaoMenuRef.current;
    document.body.style.overflow = "hidden";

    const focaveis = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );

    focaveis()[0]?.focus();

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        fechar();
        return;
      }
      if (evento.key !== "Tab") return;

      const lista = focaveis();
      if (lista.length === 0) return;

      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      const atual = document.activeElement;

      if (evento.shiftKey && atual === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && atual === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
      botaoQueAbriu?.focus();
    };
  }, [aberto, fechar]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only rounded-peca bg-madeira-mel px-4 py-2 text-corpo-sm font-medium text-grafite focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70]"
      >
        Pular para o conteúdo
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-suave",
          rolou
            ? "border-b border-linha bg-fundo-cal/85 backdrop-blur-md backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-6 px-5 md:h-22 md:px-10">
          <Logotipo />

          {/* Navegação — desktop */}
          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {abas.map((aba) => {
              const ativa = abaAtiva(pathname, aba.href);
              return (
                <Link
                  key={aba.href}
                  href={aba.href}
                  aria-current={ativa ? "page" : undefined}
                  className={cn(
                    "text-corpo-sm rounded-mini px-3 py-2 transition-colors duration-200 ease-suave",
                    "border-b border-transparent",
                    ativa
                      ? "text-nogueira border-b-madeira-mel-escuro"
                      : "text-grafite/75 hover:text-nogueira",
                  )}
                >
                  {aba.rotulo}
                </Link>
              );
            })}

            {/* Ação principal. Não é uma aba: sai do site para a conversa. */}
            <BotaoWhatsApp
              origem="header"
              className="text-corpo-sm ml-3 inline-flex h-11 items-center gap-2 rounded-peca bg-madeira-mel px-5 font-medium text-grafite transition-colors duration-200 ease-suave hover:bg-madeira-mel-claro"
            >
              <IconeWhatsApp className="size-4" />
              WhatsApp
            </BotaoWhatsApp>
          </nav>

          {/* Abre o drawer — mobile e tablet */}
          <button
            ref={botaoMenuRef}
            type="button"
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            aria-expanded={aberto}
            aria-controls={ID_DRAWER}
            className="inline-flex size-11 items-center justify-center rounded-peca border border-linha-controle text-nogueira transition-colors duration-200 ease-suave hover:bg-areia-clara lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="size-5"
            >
              <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
            </svg>
          </button>
        </div>
      </header>

      {/* Drawer lateral ------------------------------------------------- */}
      <div
        onClick={fechar}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-grafite/40 transition-opacity duration-300 ease-suave lg:hidden",
          aberto ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        id={ID_DRAWER}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!aberto}
        className={cn(
          "fixed inset-y-0 right-0 z-60 flex w-[min(20rem,85vw)] flex-col",
          "border-l border-linha bg-fundo-cal transition-transform duration-300 ease-suave lg:hidden",
          aberto ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-linha px-5 py-5">
          <Logotipo aoClicar={fechar} />
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar menu"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-peca border border-linha-controle text-nogueira transition-colors duration-200 ease-suave hover:bg-areia-clara"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="size-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label="Principal (mobile)" className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="divide-y divide-linha">
            {abas.map((aba) => {
              const ativa = abaAtiva(pathname, aba.href);
              return (
                <li key={aba.href}>
                  <Link
                    href={aba.href}
                    onClick={fechar}
                    aria-current={ativa ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between py-4 font-display text-display-sm transition-colors duration-200 ease-suave",
                      // A ativa é a mais escura; o ponto em mel confirma.
                      // Mel como cor de texto não passa em AA neste tamanho.
                      ativa ? "text-nogueira" : "text-nogueira-suave",
                    )}
                  >
                    {aba.rotulo}
                    {ativa && (
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-madeira-mel-escuro"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Ação principal, fixa no pé do drawer. */}
        <div className="border-t border-linha px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <BotaoWhatsApp
            origem="drawer-mobile"
            onClick={fechar}
            className="text-corpo flex h-13 w-full items-center justify-center gap-2 rounded-peca bg-madeira-mel font-medium text-grafite transition-colors duration-200 ease-suave hover:bg-madeira-mel-claro"
          >
            <IconeWhatsApp className="size-5" />
            Pedir orçamento
          </BotaoWhatsApp>
          <p className="text-corpo-sm mt-3 text-center text-nogueira-suave">
            {site.regiao} · resposta no mesmo dia
          </p>
        </div>
      </div>
    </>
  );
}
