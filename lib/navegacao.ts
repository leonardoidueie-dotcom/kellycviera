export type Aba = {
  rotulo: string;
  href: string;
};

/**
 * Abas do menu. O WhatsApp não entra aqui: ele não é uma página do site,
 * é a ação principal — sai como botão, separado, no Header e no drawer.
 */
export const abas: Aba[] = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Móveis", href: "/moveis" },
  { rotulo: "Ambientes", href: "/ambientes" },
  { rotulo: "Sobre", href: "/sobre" },
];

/** Marca a aba ativa. "/" só casa exato; o resto casa com as filhas. */
export function abaAtiva(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
