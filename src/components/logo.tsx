"use client";

import { useEffect, useState } from "react";

/**
 * Logo da marca.
 *
 * Usa /public/fotos/logo.png quando o arquivo existir. Enquanto não existir,
 * desenha um selo redondo com as iniciais, no mesmo espírito da marca — assim
 * o site nunca aparece com um retângulo quebrado no topo.
 */
export default function Logo({
  className = "h-10 w-10",
  src = "/fotos/logo.png",
}: {
  className?: string;
  src?: string;
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

  if (ok) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt="Tok Rústico"
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      aria-label="Tok Rústico"
      role="img"
      className={`${className} grid place-items-center rounded-full border border-dourado/40 bg-grafite-claro`}
    >
      <span className="font-display text-[13px] leading-none text-dourado">
        tr
      </span>
    </span>
  );
}
