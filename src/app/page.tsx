import MesaShowcase from "@/components/mesa-showcase";
import PhotoBackdrop from "@/components/photo-backdrop";
import VideoShowcase from "@/components/video-showcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-grafite">
      {/* ---------------------------- Visualizador 3D ---------------------------- */}
      <section
        id="mesa-3d"
        className="relative overflow-hidden bg-gradient-to-b from-grafite via-grafite-claro to-grafite"
      >
        {/* foto da loja ao fundo, desfocada — some sozinha se não existir */}
        <PhotoBackdrop />

        <div className="mx-auto max-w-6xl px-6 pt-12 md:pt-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
            Tok Rústico
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-areia md:text-6xl">
            Mesa Rústica
            <span className="block text-dourado/90">220 × 100 cm</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-areia/60">
            Tampo em pranchas de madeira de demolição com travamento nas
            cabeceiras, sobre pés maciços em “U” invertido. Gire, aproxime e
            toque nos pontos para ver o acabamento de perto.
          </p>
        </div>

        <MesaShowcase />
      </section>

      {/* -------------------------------- Vídeo -------------------------------- */}
      <section
        id="loja"
        className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-16 md:py-24"
      >
        <div>
          <h2 className="font-display text-3xl text-areia md:text-4xl">
            Feito à mão, peça por peça
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-areia/60">
            Cada móvel sai da nossa oficina com o veio, os nós e as marcas da
            madeira original preservados. O vídeo mostra a loja e as peças
            prontas para levar.
          </p>
        </div>

        <VideoShowcase />
      </section>
    </main>
  );
}
