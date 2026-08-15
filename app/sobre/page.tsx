import type { Metadata } from "next";
import { AberturaPagina } from "@/components/layout/AberturaPagina";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A marcenaria de Kelly Brandão em Minas Gerais: oficina própria, madeira maciça e de demolição, do desenho à instalação.",
};

export default function SobrePage() {
  return (
    <AberturaPagina
      etiqueta="A marcenaria"
      titulo="Apaixonada por marcenaria"
      texto={`${site.frase} Oficina própria em ${site.regiao}, do desenho à instalação.`}
    />
  );
}
