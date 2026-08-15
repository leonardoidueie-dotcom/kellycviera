type Classe = string | false | null | undefined;

/** Junta classes condicionais sem trazer dependência nova. */
export function cn(...classes: Classe[]) {
  return classes.filter(Boolean).join(" ");
}
