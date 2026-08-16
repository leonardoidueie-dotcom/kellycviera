"use client";

import { useCallback, useState } from "react";

import MesaSpin360 from "./mesa-spin-360";
import MesaViewer from "./mesa-viewer";

/**
 * Decide sozinho como mostrar a mesa:
 *
 *  1. se existirem fotos reais em /public/mesa-360/, usa o giro fotográfico
 *     (fotorrealista, porque são fotos da peça de verdade);
 *  2. se não existirem, cai no visualizador 3D.
 *
 * Ou seja: basta publicar as fotos na pasta que o site se atualiza sozinho,
 * sem tocar em código.
 */
export default function MesaShowcase({
  frames = 24,
  className = "",
}: {
  frames?: number;
  className?: string;
}) {
  const [semFotos, setSemFotos] = useState(false);
  const handleMissing = useCallback(() => setSemFotos(true), []);

  if (semFotos) return <MesaViewer className={className} />;

  return (
    <>
      <MesaSpin360
        frames={frames}
        className={className}
        onMissing={handleMissing}
      />
      {/* enquanto as fotos não respondem, nada é renderizado pelo giro;
          o 3D só entra depois que sabemos que elas não existem */}
    </>
  );
}
