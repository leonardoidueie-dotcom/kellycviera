import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * Provisório. As páginas do site entram na próxima etapa — por ora, só um
 * ponto de entrada para a /styleguide.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-24">
      <p className="text-etiqueta text-madeira-mel uppercase">
        {site.nome} {site.assinatura} · {site.regiao}
      </p>
      <h1 className="text-display-xl mt-4 font-display text-nogueira">
        {site.frase}
      </h1>
      <p className="text-corpo-lg mt-6 max-w-[52ch] text-grafite/80">
        Site em construção. O design system já está montado.
      </p>
      <div className="mt-8">
        <ButtonLink href="/styleguide" tamanho="lg">
          Ver o design system
        </ButtonLink>
      </div>
    </main>
  );
}
