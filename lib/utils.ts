/** Junta classes ignorando valores falsos. Evita dependência extra. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Formata o índice do case como "CS 001". */
export function caseCode(index: number): string {
  return `CS ${String(index + 1).padStart(3, '0')}`;
}

/** Separa uma frase em palavras preservando espaços para animação por palavra. */
export function splitWords(text: string): string[] {
  return text.split(' ').filter(Boolean);
}

/** Formata número grande no padrão brasileiro (38.000). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(Math.round(value));
}
