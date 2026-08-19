"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

/**
 * <MesaViewer /> — visualizador 3D da mesa de jantar rústica.
 *
 * A cena (three / @react-three/fiber) é carregada só no cliente via
 * next/dynamic com { ssr: false }. Sem WebGL, cai para a foto estática
 * com o mesmo enquadramento.
 */

const MesaViewerScene = dynamic(() => import("./mesa-viewer-scene"), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
});

function ViewerSkeleton() {
  return (
    <div className="grid h-[60vh] w-full place-items-center md:h-[80vh]">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border border-dourado/25 border-t-dourado motion-reduce:animate-none" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-areia/40">
          Carregando a mesa
        </span>
      </div>
    </div>
  );
}

function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

function StaticFallback() {
  const [broken, setBroken] = useState(false);

  return (
    <div className="relative h-[60vh] w-full overflow-hidden md:h-[80vh]">
      {broken ? (
        <div className="grid h-full w-full place-items-center bg-gradient-to-b from-grafite-claro to-grafite">
          <p className="font-display text-lg text-areia/60">
            Mesa Rústica 220 × 100 cm
          </p>
        </div>
      ) : (
        <Image
          src="/mesa-rustica.png"
          alt="Mesa de jantar rústica em madeira maciça de demolição, tampo de 220 × 100 cm sobre pés em U invertido"
          fill
          sizes="100vw"
          priority
          className="object-contain"
          onError={() => setBroken(true)}
        />
      )}
      <p className="absolute inset-x-0 bottom-4 text-center text-[10px] uppercase tracking-[0.3em] text-areia/35">
        Visualização 3D indisponível neste dispositivo
      </p>
    </div>
  );
}

export default function MesaViewer({ className = "" }: { className?: string }) {
  const [state, setState] = useState<"checking" | "webgl" | "fallback">(
    "checking",
  );

  useEffect(() => {
    setState(hasWebGL() ? "webgl" : "fallback");
  }, []);

  if (state === "checking") return <ViewerSkeleton />;
  if (state === "fallback") return <StaticFallback />;

  return <MesaViewerScene className={className} />;
}
