import type { Metadata } from "next";
import { AberturaPagina } from "@/components/layout/AberturaPagina";

export const metadata: Metadata = {
  title: "Ambientes",
  description:
    "Projetos montados: sala, jantar, varanda e jardim vertical artificial. Veja a peça no lugar dela.",
};

export default function AmbientesPage() {
  return (
    <AberturaPagina
      etiqueta="Projetos"
      titulo="A peça no lugar dela"
      texto="Sala, jantar, varanda e jardim vertical. O móvel pronto, dentro da casa do cliente."
    />
  );
}
