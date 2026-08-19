import Catalogo from "@/components/catalogo";
import HeroMesa from "@/components/hero-mesa";
import Orcamento from "@/components/orcamento";
import PhotoBackdrop from "@/components/photo-backdrop";
import Reveal from "@/components/reveal";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import VideoShowcase from "@/components/video-showcase";
import WhatsAppFlutuante from "@/components/whatsapp-flutuante";
import { loja } from "@/lib/loja";

const pilares = [
  {
    numero: "01",
    titulo: "Madeira de demolição",
    texto:
      "Vigas e tábuas que já foram casa, galpão, ponte. Cada marca no veio é tempo — nada disso se imita em madeira nova.",
  },
  {
    numero: "02",
    titulo: "Encaixe e cavilha",
    texto:
      "As uniões são de marcenaria: cavilha e cola estrutural. Nenhuma ferragem aparece na peça pronta.",
  },
  {
    numero: "03",
    titulo: "Óleo fosco",
    texto:
      "O acabamento realça o veio sem o brilho plástico do verniz, e pode ser renovado em casa com um pano.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="topo" className="bg-grafite">
        {/* ---------------------------- 1. Topo ---------------------------- */}
        <HeroMesa />

        {/* ---------------------- 2. Faixa de assinatura ---------------------- */}
        <div className="border-y border-grafite-borda bg-grafite-claro/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-[10px] uppercase tracking-[0.3em] text-areia/40">
            <span>Peças únicas</span>
            <span className="text-dourado/50">·</span>
            <span>Feito sob medida</span>
            <span className="text-dourado/50">·</span>
            <span>Madeira maciça e de demolição</span>
            <span className="text-dourado/50">·</span>
            <span>Acabamento à mão</span>
          </div>
        </div>

        {/* ------------------------ 3. Como é feita ------------------------ */}
        <section className="relative overflow-hidden">
          {/* a própria madeira da peça, quase apagada, como papel de parede */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
            style={{
              backgroundImage: "url(/texturas/madeira-tampo.jpg)",
              backgroundSize: "820px auto",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
                O ofício
              </p>
              <h2 className="mt-3 max-w-xl font-display text-4xl leading-[1.05] text-areia md:text-5xl">
                Três coisas que a fábrica não faz
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {pilares.map((item, i) => (
                <Reveal key={item.titulo} atraso={i * 140}>
                  <div className="border-t border-grafite-borda pt-6">
                    <span className="font-display text-2xl text-dourado/40">
                      {item.numero}
                    </span>
                    <h3 className="mt-3 font-display text-2xl text-areia">
                      {item.titulo}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-areia/60">
                      {item.texto}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- 4. Peças --------------------------- */}
        <Catalogo />

        {/* ------------------------ 5. Quem somos ------------------------ */}
        <section id="quem-somos" className="relative overflow-hidden">
          <PhotoBackdrop
            fontes={["/fotos/loja.jpg", "/fotos/ambiente-cozinha.png"]}
            blur={24}
            escurecer={0.87}
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
                Quem somos
              </p>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] text-areia md:text-6xl">
                Uma loja de madeira,
                <span className="block text-dourado/90">não de móveis</span>
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-areia/60">
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
                className="mt-8 inline-block border-b border-dourado/40 pb-1 text-[11px] uppercase tracking-[0.2em] text-dourado transition hover:border-dourado"
              >
                Ver no Instagram →
              </a>
            </Reveal>

            <Reveal atraso={160}>
              <VideoShowcase
                src="/video/mesas-tour.mp4"
                vertical
                titulo="Mesa é história"
                legenda="Um passeio pelas mesas do salão, contado por quem as escolhe."
              />
            </Reveal>
          </div>
        </section>

        {/* -------------------------- 6. A loja -------------------------- */}
        <section className="relative overflow-hidden border-t border-grafite-borda">
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
            <Reveal>
              <VideoShowcase
                titulo="A loja por dentro"
                legenda="Peças prontas para levar, no salão."
              />
            </Reveal>

            <Reveal atraso={160}>
              <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
                Visite
              </p>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] text-areia md:text-5xl">
                Venha ver de perto
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-areia/60">
                Madeira se escolhe com a mão. No salão dá para sentir o peso,
                ver o veio na luz certa e decidir o acabamento olhando a peça.
              </p>

              <dl className="mt-8 space-y-4 border-l border-dourado/25 pl-5 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-areia/35">
                    Endereço
                  </dt>
                  <dd className="mt-1 text-areia/75">{loja.endereco}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-areia/35">
                    Horário
                  </dt>
                  <dd className="mt-1 text-areia/75">{loja.horario}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ------------------------ 7. Orçamento ------------------------ */}
        <Orcamento />
      </main>

      <SiteFooter />
      <WhatsAppFlutuante />
    </>
  );
}
