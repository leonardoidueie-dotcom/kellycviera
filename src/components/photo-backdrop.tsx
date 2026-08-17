"use client";

import { useEffect, useState } from "react";

/**
 * Foto da loja usada como fundo de uma seção.
 *
 * Fica desfocada e escurecida de propósito: serve de ambiente, não de cena.
 * Se a foto ainda não tiver sido publicada, nada é renderizado e o gradiente
 * grafite da seção continua valendo.
 */
export default function PhotoBackdrop({
  src = "/fotos/loja.jpg",
  blur = 8,
  escurecer = 0.82,
}: {
  src?: string;
  /** desfoque em px — quanto maior, mais o fundo "sai de foco" */
  blur?: number;
  /** 0 = foto crua, 1 = preto total */
  escurecer?: number;
}) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setOk(true);
    return () => {
      img.onload = null;
    };
  }, [src]);

  if (!ok) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${src})`,
          filter: `blur(${blur}px) saturate(0.85)`,
          transform: "scale(1.08)", // esconde a borda que o blur deixa
          transition: "filter 700ms ease",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(20, 18, 16, ${escurecer})`,
          transition: "background-color 700ms ease",
        }}
      />
      {/* leve vinheta, para a mesa ficar no centro da atenção */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(20,18,16,0.85)_100%)]" />
    </div>
  );
}
