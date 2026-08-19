"use client";

import { useEffect, useState } from "react";

/**
 * Foto de fundo da seção — desfocada e escurecida, para servir de ambiente
 * sem competir com a peça na frente.
 *
 * Recebe uma lista de candidatas e usa a primeira que existir. Assim a foto
 * ampla do salão entra assim que for publicada, e até lá a própria foto da
 * mesa segura o ambiente — bem melhor que fundo preto.
 */
export default function PhotoBackdrop({
  fontes = [
    "/fotos/loja.jpg",
    "/fotos/ambiente-cozinha.png",
    "/fotos/mesa-jantar.jpg",
  ],
  blur = 14,
  escurecer = 0.7,
  posicao = "center",
  vinheta = true,
}: {
  fontes?: string[];
  /** desfoque em px — 0 deixa a foto nítida */
  blur?: number;
  /** 0 = foto crua, 1 = preto total */
  escurecer?: number;
  /** enquadramento da foto, como em background-position */
  posicao?: string;
  vinheta?: boolean;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;

    const tentar = (i: number) => {
      if (!vivo || i >= fontes.length) return;
      const img = new Image();
      img.src = fontes[i];
      img.onload = () => vivo && setSrc(fontes[i]);
      img.onerror = () => tentar(i + 1);
    };

    tentar(0);
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontes.join("|")]);

  if (!src) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: posicao,
          filter: `blur(${blur}px) saturate(1.05)`,
          // só amplia quando há desfoque, para esconder a borda que ele deixa
          transform: blur > 0 ? "scale(1.1)" : "scale(1.02)",
          transition: "filter 700ms ease, transform 700ms ease",
        }}
      />

      {/* véu quente: escurece sem apagar a cor da madeira */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(23, 16, 8, ${escurecer})`,
          transition: "background-color 700ms ease",
        }}
      />

      {/* brilho âmbar no alto, como a luz pendente da loja */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_18%,rgba(201,162,39,0.16),transparent_70%)]" />

      {/* vinheta, para a peça ficar no centro da atenção */}
      {vinheta && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(23,16,8,0.8)_100%)]" />
      )}

      {/* véu à esquerda: segura a leitura do título sobre a foto nítida */}
      <div className="absolute inset-0 bg-gradient-to-r from-grafite/85 via-grafite/25 to-transparent md:w-3/5" />

      {/* emenda com a seção seguinte */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-grafite" />
    </div>
  );
}
