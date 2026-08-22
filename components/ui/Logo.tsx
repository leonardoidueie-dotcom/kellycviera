import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/**
 * LOGO — triângulo com a sigla da marca, desenhado em SVG (escala sem perder nitidez).
 * PARA TROCAR PELO ARQUIVO DA MARCA:
 * 1) coloque o SVG em /public/images/logo.svg
 * 2) troque o conteúdo deste componente por:
 *    <img src="/images/logo.svg" alt="ESTILO DE RUA" className={className} />
 */
export default function Logo({ className }: { className?: string }) {
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
