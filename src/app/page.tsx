import Catalogo from "@/components/catalogo";
import PhotoBackdrop from "@/components/photo-backdrop";
import HeroMesa from "@/components/hero-mesa";
import Orcamento from "@/components/orcamento";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import VideoShowcase from "@/components/video-showcase";
import WhatsAppFlutuante from "@/components/whatsapp-flutuante";
import { loja } from "@/lib/loja";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="topo" className="bg-grafite">
        {/* ---------------------------- 1. Topo ---------------------------- */}
        <HeroMesa />

        {/* ------------------------ 2. Como é feita ------------------------ */}
        <section className="relative overflow-hidden border-y border-grafite-borda bg-grafite-claro/40">
          {/* a própria madeira da peça, quase apagada, como papel de parede */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen"
            style={{
              backgroundImage: "url(/texturas/madeira-tampo.jpg)",
              backgroundSize: "760px auto",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 md:gap-12 md:py-20">
            {[
              {
                titulo: "Madeira de demolição",
                texto:
                  "Vigas e tábuas que já foram casa, galpão, ponte. Cada marca no veio é tempo — nada disso se imita em madeira nova.",
              },
              {
                titulo: "Encaixe e cavilha",
                texto:
                  "As uniões são de marcenaria: cavilha e cola estrutural. Nenhuma ferragem aparece na peça pronta.",
              },
              {
                titulo: "Óleo fosco",
                texto:
                  "O acabamento realça o veio sem o brilho plástico do verniz, e pode ser renovado em casa com um pano.",
              },
            ].map((item) => (
              <div key={item.titulo}>
                <h3 className="font-display text-xl text-dourado">
                  {item.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-areia/60">
                  {item.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------- 3. Peças --------------------------- */}
        <Catalogo />

        {/* ------------------------ 4. Quem somos ------------------------ */}
        <section
          id="quem-somos"
          className="relative overflow-hidden border-t border-grafite-borda"
        >
          <PhotoBackdrop
            fontes={["/fotos/loja.jpg", "/fotos/ambiente-cozinha.png"]}
            blur={22}
            escurecer={0.88}
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
                Quem somos
              </p>
              <h2 className="mt-3 font-display text-3xl text-areia md:text-5xl">
                Uma loja de madeira, não de móveis
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-areia/60">
                <p>
                  A {loja.nome} trabalha com o que a madeira maciça e de
                  demolição tem de melhor: peso, veio e história. Cada tábua
                  chega com um passado, e o trabalho é revelar isso — não
                  esconder.
                </p>
                <p>
                  Tudo é feito à mão, peça por peça, na medida do espaço de cada
                  cliente. Por isso duas mesas nunca saem iguais: a madeira não
                  deixa.
                </p>
              </div>

              <a
                href={`https://instagram.com/${loja.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-block text-[11px] uppercase tracking-[0.2em] text-dourado transition hover:text-dourado-claro"
              >
                Ver no Instagram →
              </a>
            </div>

            {/* aparece quando /public/video/apresentacao.mp4 existir */}
            <VideoShowcase
              src="/video/mesas-tour.mp4"
              vertical
              titulo="Mesa é história"
              legenda="Um passeio pelas mesas do salão, contado por quem as escolhe."
            />
          </div>
        </section>

        {/* -------------------------- 5. A loja -------------------------- */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <VideoShowcase
            titulo="A loja por dentro"
            legenda="Peças prontas para levar, no salão."
          />

          <div>
            <h2 className="font-display text-3xl text-areia md:text-4xl">
              Venha ver de perto
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-areia/60">
              Madeira se escolhe com a mão. No salão dá para sentir o peso, ver
              o veio na luz certa e decidir o acabamento olhando a peça.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-areia/70">
              {loja.endereco}
              <br />
              <span className="text-areia/45">{loja.horario}</span>
            </p>
          </div>
        </section>

        {/* ------------------------ 6. Orçamento ------------------------ */}
        <Orcamento />
      </main>

      <SiteFooter />
      <WhatsAppFlutuante />
    </>
  );
}
