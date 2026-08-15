import { ButtonLink } from "@/components/ui/Button";
import { CardPeca } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { moveisPublicados } from "@/data/moveis";

/**
 * Vitrine da home: só as peças marcadas com `destaque: true` em
 * data/moveis.ts. Para trocar o que aparece aqui, mexa lá — não neste arquivo.
 */
export function Destaques() {
  const destaques = moveisPublicados.filter((m) => m.destaque).slice(0, 3);

  if (destaques.length === 0) return null;

  return (
    <section className="border-b border-linha">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-etiqueta text-nogueira-suave uppercase">
              Peças em destaque
            </p>
            <h2 className="text-display-md mt-3 max-w-[18ch] font-display text-nogueira">
              O que está saindo da oficina
            </h2>
          </div>
          <ButtonLink href="/moveis" variante="contorno">
            Ver o catálogo
          </ButtonLink>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((peca, i) => (
            <Reveal as="li" key={peca.slug} atraso={i * 90}>
              <CardPeca
                nome={peca.nome}
                categoria={peca.categoria}
                ficha={peca.medidas}
                imagem={peca.imagens[0].src}
                alt={peca.imagens[0].alt}
                href="/moveis"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
