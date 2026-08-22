import type { Config } from 'tailwindcss';

/**
 * ONDE MEXER NAS CORES:
 * As cores vivem em `app/globals.css` (bloco `:root`), como variáveis CSS.
 * Aqui elas só são expostas para as classes utilitárias do Tailwind
 * (ex.: `text-accent`, `bg-ink`, `border-accent/40`).
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './site.config.ts',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',        // fundo quase preto
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',    // texto branco
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',  // cor de destaque única
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'Haettenschweiler', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Títulos gigantes e fluidos (3rem -> 9rem)
        mega: ['clamp(3rem, 11vw, 9rem)', { lineHeight: '0.86', letterSpacing: '-0.04em' }],
        huge: ['clamp(2.5rem, 7vw, 5.5rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        big: ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
      maxWidth: {
        page: '100rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
