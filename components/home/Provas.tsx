import { IconeMedida, IconePlaina, IconeTora } from "@/components/ui/Icones";
import { Reveal } from "@/components/ui/Reveal";

const provas = [
  {
    Icone: IconePlaina,
    titulo: "Fabricação própria",
    texto:
      "A peça nasce e termina na nossa oficina. Ninguém terceiriza o corte nem o acabamento.",
  },
  {
    Icone: IconeTora,
    titulo: "Madeira maciça",
    texto:
      "Maciça e de demolição. Sem MDF pintado de madeira, sem lâmina colada por cima.",
  },
  {
    Icone: IconeMedida,
    titulo: "Projeto sob medida",
    texto:
      "A gente parte da medida do seu cômodo, não de um catálogo fechado de tamanhos.",
  },
];

export function Provas() {
  return (
    <section className="border-b border-linha">
      <ul className="mx-auto grid w-full max-w-7xl gap-px bg-linha md:grid-cols-3">
        {provas.map(({ Icone, titulo, texto }, i) => (
          <Reveal
            as="li"
            key={titulo}
            atraso={i * 110}
            className="bg-fundo-cal px-5 py-10 md:px-8 md:py-14"
          >
            <Icone className="size-9 text-madeira-mel-escuro" />
            <h2 className="text-display-sm mt-5 font-display text-nogueira">
              {titulo}
            </h2>
            <p className="text-corpo-sm mt-2 max-w-[34ch] text-grafite/75">
              {texto}
            </p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
