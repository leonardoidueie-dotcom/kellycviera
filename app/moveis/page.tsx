import type { Metadata } from "next";
import { AberturaPagina } from "@/components/layout/AberturaPagina";

export const metadata: Metadata = {
  title: "Móveis",
  description:
    "Mesas de jantar, mesas de centro, mesas laterais, bancos, poltronas e painéis em madeira maciça e de demolição, feitos sob medida.",
};

export default function MoveisPage() {
  return (
    <AberturaPagina
      etiqueta="Catálogo"
      titulo="Peças em madeira maciça"
      texto="Mesas, bancos, poltronas e painéis. Cada peça sai da nossa oficina na medida do seu espaço."
    />
  );
}
