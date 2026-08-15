/**
 * Ícones em traço fino, desenhados para esta marcenaria — plaina, tora e
 * cota de medida. Nada de engrenagem ou selo de qualidade.
 * Decorativos: quem nomeia é o texto ao lado.
 */

const comuns = {
  viewBox: "0 0 32 32",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false as const,
};

/** Plaina de marceneiro — fabricação própria. */
export function IconePlaina({ className }: { className?: string }) {
  return (
    <svg {...comuns} className={className}>
      <path d="M3.5 20.5h25a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-25A1.5 1.5 0 0 1 2 25v-3a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M12 20.5v-4.2a3.4 3.4 0 0 1 6.8 0v4.2" />
      <path d="M8 20.5v-3.1" />
      <path d="M6.2 17.4h3.6" />
      <path d="M17 20.5 20.4 27" />
      <path d="M2 24h28" />
    </svg>
  );
}

/** Tora cortada, anéis à mostra — madeira maciça. */
export function IconeTora({ className }: { className?: string }) {
  return (
    <svg {...comuns} className={className}>
      <circle cx="16" cy="16" r="12.5" />
      <circle cx="15.4" cy="16.4" r="9" />
      <circle cx="14.9" cy="16.8" r="5.6" />
      <circle cx="14.5" cy="17.1" r="2.4" />
      <path d="M27.6 12.9c-2.2.5-3.9.7-5.4.6" />
      <path d="M4.6 21.4c2-.8 3.6-1.2 5-1.3" />
    </svg>
  );
}

/** Cota de medida sobre a peça — projeto sob medida. */
export function IconeMedida({ className }: { className?: string }) {
  return (
    <svg {...comuns} className={className}>
      <path d="M4.5 6.5h23a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-23A1.5 1.5 0 0 1 3 17V8a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M9 6.5v3M16 6.5v3M23 6.5v3" />
      <path d="M3 26h26" />
      <path d="M3 23v6M29 23v6" />
      <path d="M6.8 24.2 3.6 26l3.2 1.8" />
      <path d="M25.2 24.2 28.4 26l-3.2 1.8" />
    </svg>
  );
}
