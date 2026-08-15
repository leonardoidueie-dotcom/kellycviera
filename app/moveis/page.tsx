import type { Metadata } from "next";
import { Catalogo } from "@/components/catalogo/Catalogo";
import { AberturaPagina } from "@/components/layout/AberturaPagina";
import { moveisPublicados } from "@/data/moveis";

export const metadata: Metadata = {
  title: "Móveis",
  description:
    "Mesas de jantar, mesas de centro, mesas laterais, bancos e poltronas em madeira maciça e de demolição, feitos sob medida na nossa oficina em Minas Gerais.",
};

export default function MoveisPage() {
  return (
    <>
      <AberturaPagina
        etiqueta="Catálogo"
        titulo="Peças em madeira maciça"
        texto="Tudo o que está aqui sai da nossa oficina. Escolha a peça, a gente ajusta a medida ao seu espaço."
      />
      <Catalogo moveis={moveisPublicados} />
    </>
  );
}
