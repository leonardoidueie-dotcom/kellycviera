"use client";

import { useEffect, useRef, useState } from "react";

import { linkWhatsApp, loja } from "@/lib/loja";
import PhotoBackdrop from "./photo-backdrop";

/**
 * Abertura do site: quem faz, falando.
 *
 * Nenhuma peça vende madeira de demolição melhor que a pessoa que a escolhe.
 * O vídeo é vertical — de celular — então fica num quadro retrato ao lado do
 * texto, em vez de ser esticado na largura da tela.
 */
export default function HeroApresentacao({
  src = "/video/apresentacao.mp4",
}: {
  src?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mudo, setMudo] = useState(true);
  const [tocando, setTocando] = useState(false);
  const [semVideo, setSemVideo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const falhou = () => setSemVideo(true);
    video.addEventListener("error", falhou);

    const conferir = window.setTimeout(() => {
      const semFonte =
        video.error !== null ||
        video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
      if (video.readyState === 0 && semFonte) falhou();
    }, 3500);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.play().catch(() => {
        /* autoplay bloqueado: o visitante aperta play */
      });
    }

    return () => {
      video.removeEventListener("error", falhou);
      window.clearTimeout(conferir);
    };
  }, [src]);

  const alternar = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  const botao =
    "rounded-full border border-areia/25 bg-grafite/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-areia/80 backdrop-blur transition hover:border-dourado/70 hover:text-dourado";

  return (
    <section
      id="topo-video"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <PhotoBackdrop
        blur={0}
        escurecer={0.62}
        posicao="center 30%"
        vinheta={false}
      />

      <div
        className={`relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 md:gap-16 md:py-24 ${
          semVideo ? "md:grid-cols-1" : "md:grid-cols-[1.05fr_0.95fr]"
        }`}
      >
        {/* ------------------------------ texto ------------------------------ */}
        {/* sem vídeo, o texto ocupa o palco sozinho em vez de deixar um vazio */}
        <div className={semVideo ? "max-w-2xl" : ""}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/80">
            {loja.chamada}
          </p>

          <h1 className="mt-4 font-display text-5xl leading-[0.98] text-areia md:text-7xl">
            Madeira que já
            <span className="block text-dourado/90">viveu antes</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-areia/70">
            Vigas e tábuas que foram casa, galpão, ponte — hoje mesas que ficam
            na família. Cada peça sai da nossa oficina feita à mão, na medida do
            seu espaço.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="rounded-full bg-dourado px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-grafite transition hover:bg-dourado-claro"
            >
              Ver as peças
            </a>
            <a
              href={linkWhatsApp(
                `Olá! Vim pelo site da ${loja.nome} e gostaria de um orçamento.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-areia/25 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-areia/85 transition hover:border-dourado hover:text-dourado"
            >
              Pedir orçamento
            </a>
          </div>

          <a
            href="#mesa-3d"
            className="mt-10 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-areia/45 transition hover:text-dourado"
          >
            <span className="h-px w-8 bg-dourado/50" />
            Ver a mesa por dentro
          </a>
        </div>

        {/* ------------------------------ vídeo ------------------------------ */}
        {!semVideo && (
          <figure className="relative mx-auto w-full max-w-[380px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-dourado/20 bg-grafite-claro shadow-2xl shadow-black/50">
              <video
                ref={videoRef}
                src={src}
                muted={mudo}
                loop
                playsInline
                preload="auto"
                onPlay={() => setTocando(true)}
                onPause={() => setTocando(false)}
                onClick={alternar}
                className="h-full w-full cursor-pointer object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-grafite/70 via-transparent to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-areia/60">
                  Quem faz
                </span>
                <div className="flex gap-2">
                  <button type="button" className={botao} onClick={alternar}>
                    {tocando ? "Pausar" : "Play"}
                  </button>
                  <button
                    type="button"
                    className={botao}
                    aria-pressed={!mudo}
                    onClick={() => {
                      const video = videoRef.current;
                      if (!video) return;
                      video.muted = !video.muted;
                      setMudo(video.muted);
                    }}
                  >
                    {mudo ? "Som" : "Mudo"}
                  </button>
                </div>
              </div>
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}
