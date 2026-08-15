import * as THREE from "three";

/**
 * Texturas de madeira geradas em runtime (canvas 2D) — nenhum asset externo.
 * A ideia é imitar madeira de demolição: veio longitudinal irregular,
 * nós esparsos, rachaduras finas e variação de tom entre as pranchas.
 */

type WoodOptions = {
  /** cor base da prancha (tom mel) */
  base?: string;
  /** semente para o ruído — pranchas diferentes, veios diferentes */
  seed?: number;
  /** quantas vezes o veio se repete ao longo do comprimento */
  grain?: number;
  /** resolução do canvas */
  width?: number;
  height?: number;
};

export type WoodMaps = {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
};

/** PRNG determinístico (mulberry32) */
function makeRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** ruído de valor 1D suavizado — usado para ondular as linhas do veio */
function makeNoise1D(rand: () => number, points = 64) {
  const table = Array.from({ length: points }, () => rand() * 2 - 1);
  return (x: number) => {
    const scaled = x * points;
    const i = Math.floor(scaled);
    const f = scaled - i;
    const a = table[((i % points) + points) % points];
    const b = table[((i + 1) % points + points) % points];
    const s = f * f * (3 - 2 * f); // smoothstep
    return a + (b - a) * s;
  };
}

function shade(hex: string, amount: number) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, THREE.MathUtils.clamp(hsl.l + amount, 0, 1));
  return `#${c.getHexString()}`;
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Gera map (cor), bumpMap e roughnessMap coerentes entre si.
 * O veio corre no eixo X do canvas (comprimento da prancha).
 */
export function createWoodMaps({
  base = "#B98B52",
  seed = 1,
  grain = 1,
  width = 1024,
  height = 256,
}: WoodOptions = {}): WoodMaps {
  const rand = makeRandom(seed * 9781 + 17);
  const wobble = makeNoise1D(rand, 48);
  const wobble2 = makeNoise1D(rand, 12);

  const colorCanvas = createCanvas(width, height);
  const heightCanvas = createCanvas(width, height);
  const ctx = colorCanvas.getContext("2d")!;
  const hctx = heightCanvas.getContext("2d")!;

  // --- fundo -------------------------------------------------------------
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);
  hctx.fillStyle = "#808080";
  hctx.fillRect(0, 0, width, height);

  // manchas largas de tom (madeira reaproveitada nunca é uniforme)
  for (let i = 0; i < 18; i++) {
    const cx = rand() * width;
    const cy = rand() * height;
    const r = 60 + rand() * 240;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const tone = shade(base, (rand() - 0.45) * 0.09);
    g.addColorStop(0, tone);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  ctx.globalAlpha = 1;

  // --- veios -------------------------------------------------------------
  const lines = Math.round(height * 0.75);
  ctx.lineWidth = 1;
  hctx.lineWidth = 1;

  for (let i = 0; i < lines; i++) {
    const y0 = (i / lines) * height + (rand() - 0.5) * 2;
    const dark = rand() < 0.3;
    const strength = 0.04 + rand() * 0.12;
    const amp = 2 + rand() * 7;
    const freq = (0.6 + rand() * 1.6) * grain;
    const phase = rand() * 10;

    ctx.strokeStyle = dark
      ? `rgba(120, 79, 40, ${strength})`
      : `rgba(240, 216, 180, ${strength * 1.1})`;
    hctx.strokeStyle = dark
      ? `rgba(0, 0, 0, ${strength * 0.9})`
      : `rgba(255, 255, 255, ${strength * 0.6})`;

    ctx.beginPath();
    hctx.beginPath();
    for (let x = 0; x <= width; x += 6) {
      const t = x / width;
      const y =
        y0 +
        wobble(t * freq + phase) * amp +
        wobble2(t * 0.5 + phase * 0.3) * amp * 1.6;
      if (x === 0) {
        ctx.moveTo(x, y);
        hctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        hctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    hctx.stroke();
  }

  // --- nós ---------------------------------------------------------------
  const knots = 1 + Math.floor(rand() * 3);
  for (let k = 0; k < knots; k++) {
    const cx = width * (0.1 + rand() * 0.8);
    const cy = height * (0.15 + rand() * 0.7);
    const rings = 5 + Math.floor(rand() * 6);
    for (let r = rings; r > 0; r--) {
      const rx = r * (3 + rand() * 3);
      const ry = rx * (0.35 + rand() * 0.2);
      ctx.strokeStyle = `rgba(104, 66, 32, ${0.04 + (r / rings) * 0.12})`;
      hctx.strokeStyle = `rgba(0, 0, 0, ${0.05 + (r / rings) * 0.2})`;
      ctx.lineWidth = 1 + rand();
      hctx.lineWidth = ctx.lineWidth;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, (rand() - 0.5) * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      hctx.beginPath();
      hctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      hctx.stroke();
    }
  }

  // --- rachaduras e marcas de demolição ----------------------------------
  const cracks = 2 + Math.floor(rand() * 4);
  for (let c = 0; c < cracks; c++) {
    const y = rand() * height;
    const x0 = rand() * width * 0.7;
    const len = width * (0.08 + rand() * 0.3);
    ctx.strokeStyle = "rgba(78, 48, 22, 0.28)";
    hctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
    ctx.lineWidth = 1 + rand() * 1.5;
    hctx.lineWidth = ctx.lineWidth;
    ctx.beginPath();
    hctx.beginPath();
    ctx.moveTo(x0, y);
    hctx.moveTo(x0, y);
    for (let x = x0; x < x0 + len; x += 10) {
      const yy = y + (rand() - 0.5) * 3;
      ctx.lineTo(x, yy);
      hctx.lineTo(x, yy);
    }
    ctx.stroke();
    hctx.stroke();
  }

  // --- grão fino ---------------------------------------------------------
  const img = ctx.getImageData(0, 0, width, height);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (rand() - 0.5) * 9;
    data[i] = THREE.MathUtils.clamp(data[i] + n, 0, 255);
    data[i + 1] = THREE.MathUtils.clamp(data[i + 1] + n, 0, 255);
    data[i + 2] = THREE.MathUtils.clamp(data[i + 2] + n, 0, 255);
  }
  ctx.putImageData(img, 0, 0);

  // roughness: madeira mais áspera onde o veio é escuro/rachado
  const roughCanvas = createCanvas(width, height);
  const rctx = roughCanvas.getContext("2d")!;
  rctx.fillStyle = "#bfbfbf";
  rctx.fillRect(0, 0, width, height);
  rctx.globalAlpha = 0.55;
  rctx.filter = "invert(1)";
  rctx.drawImage(heightCanvas, 0, 0);
  rctx.filter = "none";
  rctx.globalAlpha = 1;

  const map = new THREE.CanvasTexture(colorCanvas);
  const bumpMap = new THREE.CanvasTexture(heightCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);

  for (const tex of [map, bumpMap, roughnessMap]) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
  }
  map.colorSpace = THREE.SRGBColorSpace;

  return {
    map,
    bumpMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      bumpMap.dispose();
      roughnessMap.dispose();
    },
  };
}
