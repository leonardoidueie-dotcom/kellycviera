import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/**
 * LOGO
 * PARA USAR O ARQUIVO DA MARCA:
 * 1) coloque o arquivo em /public/images/logo.svg (ou .png transparente)
 * 2) em site.config.ts, mude `brand.logoSrc` para '/images/logo.svg'
 * Enquanto `logoSrc` for null, vale o desenho em SVG abaixo.
 */
export default function Logo({ className }: { className?: string }) {
  if (site.brand.logoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={site.brand.logoSrc}
        alt={`${site.brand.name} — logo`}
        className={cn('h-9 w-auto', className)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 64 56"
      role="img"
      aria-label={`${site.brand.name} — logo`}
      className={cn('h-9 w-auto', className)}
    >
      <path
        d="M32 3 61 53H3L32 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M20 40h24" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        letterSpacing="0.5"
        fill="currentColor"
        fontFamily="var(--font-display), sans-serif"
      >
        {site.brand.shortName}
      </text>
    </svg>
  );
}
