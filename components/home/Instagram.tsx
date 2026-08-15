import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { moveisPublicados } from "@/data/moveis";
import { site } from "@/lib/site";

/**
 * Prova social sem peso: três fotos que linkam o perfil, nenhum script de
 * terceiro. Embed de Instagram custaria centenas de kB e derrubaria a página.
 */
export function Instagram() {
  const fotos = moveisPublicados.slice(0, 3).map((m) => m.imagens[0]);

  return (
    <section className="border-b border-linha">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-etiqueta text-nogueira-suave uppercase">
              No Instagram
            </p>
            <h2 className="text-display-md mt-3 max-w-[20ch] font-display text-nogueira">
              +10 mil pessoas acompanham a marcenaria
            </h2>
            <p className="text-corpo mt-4 max-w-[46ch] text-grafite/80">
              A peça sai da oficina e vai direto para o feed. É lá que dá para
              ver a madeira de perto, ainda em processo.
            </p>
          </div>

          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-corpo-sm inline-flex h-11 items-center rounded-peca border border-linha-controle px-5 text-nogueira transition-colors duration-200 ease-suave hover:bg-areia-clara"
          >
            Seguir {site.instagram.usuario}
            <span className="sr-only"> no Instagram (abre em nova aba)</span>
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-3 gap-3 md:gap-5">
          {fotos.map((foto, i) => (
            <Reveal as="li" key={foto.src} atraso={i * 90}>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label={`${foto.alt} — abrir o perfil ${site.instagram.usuario} no Instagram (abre em nova aba)`}
              >
                <div className="moldura-peca relative aspect-square w-full">
                  <Image
                    src={foto.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 33vw, 30vw"
                    loading="lazy"
                    className="zoom-madeira object-cover"
                  />
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
