"use client";

import { useCallback, useState } from "react";

import MesaSpin360 from "./mesa-spin-360";
import MesaSpinVideo from "./mesa-spin-video";
import MesaViewer from "./mesa-viewer";

/**
 * Escolhe sozinho a melhor forma de mostrar a mesa, na ordem de realismo:
 *
 *  1. vídeo real girando em torno da peça (/public/video/mesa-360.mp4),
 *     arrastável — é filmagem, então é fotorrealista;
 *  2. sequência de fotos reais (/public/mesa-360/frame-01.jpg…);
 *  3. o visualizador 3D, que sempre funciona.
 *
 * Cada etapa avisa quando o arquivo não existe e passa a vez para a
 * seguinte. Na prática: basta publicar o vídeo ou as fotos que o site
 * se atualiza, sem tocar em código.
 */

type Etapa = "video" | "fotos" | "3d";

export default function MesaShowcase({
  frames = 24,
  className = "",
}: {
  frames?: number;
  className?: string;
}) {
  const [etapa, setEtapa] = useState<Etapa>("video");

  const semVideo = useCallback(() => setEtapa("fotos"), []);
  const semFotos = useCallback(() => setEtapa("3d"), []);

  if (etapa === "video") {
    return <MesaSpinVideo className={className} onMissing={semVideo} />;
  }

  if (etapa === "fotos") {
    return (
      <MesaSpin360
        frames={frames}
        className={className}
        onMissing={semFotos}
      />
    );
  }

  return <MesaViewer className={className} />;
}
