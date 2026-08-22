/**
 * GERADOR DE IMAGENS PLACEHOLDER
 * Cria arquivos .webp em /public/images para o site rodar sem as fotos reais.
 *
 * Rode com:  npm run placeholders
 *
 * QUANDO TIVER AS FOTOS DE VERDADE: apague o arquivo correspondente em
 * /public/images e coloque o seu com o MESMO NOME (ou aponte outro caminho
 * em site.config.ts). Formatos recomendados: .webp ou .avif.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.join(process.cwd(), 'public', 'images');

const INK = '#0D0D0D';
const ACCENT = '#8FB8E8';
const PAPER = '#F5F5F5';

/** Monta um SVG com listras, triângulo da marca e rótulo. */
function svg({ width, height, label, sub }) {
  const min = Math.min(width, height);
  const tri = min * 0.42;
  const cx = width / 2;
  const cy = height / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="stripes" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <rect width="26" height="26" fill="${INK}"/>
      <rect width="13" height="26" fill="#151515"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#stripes)"/>
  <rect width="${width}" height="${height}" fill="url(#fade)"/>

  <g transform="translate(${cx} ${cy - min * 0.08})">
    <path d="M0 ${-tri / 2} ${tri / 2} ${tri / 2} ${-tri / 2} ${tri / 2} Z"
          fill="none" stroke="${ACCENT}" stroke-opacity="0.55" stroke-width="${Math.max(2, min * 0.012)}"
          stroke-linejoin="round"/>
  </g>

  <text x="${cx}" y="${cy + min * 0.24}" text-anchor="middle"
        font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold"
        font-size="${Math.max(14, min * 0.062)}" fill="${PAPER}" letter-spacing="2">${label}</text>
  <text x="${cx}" y="${cy + min * 0.32}" text-anchor="middle"
        font-family="DejaVu Sans, Arial, sans-serif"
        font-size="${Math.max(10, min * 0.032)}" fill="${PAPER}" fill-opacity="0.45" letter-spacing="3">${sub}</text>
</svg>`;
}

const files = [
  { name: 'hero.webp', width: 1800, height: 2200, label: 'HERO', sub: 'TROQUE POR FOTO REAL' },
  { name: 'og.webp', width: 1200, height: 630, label: 'OPEN GRAPH', sub: '1200 x 630' },
  { name: 'easter-egg.webp', width: 900, height: 900, label: 'EASTER EGG', sub: 'ILUSTRACAO' },

  { name: 'menu-01.webp', width: 720, height: 900, label: 'MENU 01', sub: 'INICIO' },
  { name: 'menu-02.webp', width: 720, height: 900, label: 'MENU 02', sub: 'SERVICOS' },
  { name: 'menu-03.webp', width: 720, height: 900, label: 'MENU 03', sub: 'NUMEROS' },
  { name: 'menu-04.webp', width: 720, height: 900, label: 'MENU 04', sub: 'CASES' },
  { name: 'menu-05.webp', width: 720, height: 900, label: 'MENU 05', sub: 'CONTATO' },

  { name: 'servico-camisetas.webp', width: 1200, height: 1500, label: 'CAMISETAS', sub: 'SERVICO 01' },
  { name: 'servico-calcas.webp', width: 1200, height: 1500, label: 'CALCAS', sub: 'SERVICO 02' },
  { name: 'servico-headwear.webp', width: 1200, height: 1500, label: 'HEADWEAR', sub: 'SERVICO 03' },
  { name: 'servico-colecoes.webp', width: 1200, height: 1500, label: 'COLECOES', sub: 'SERVICO 04' },
  { name: 'servico-estampas.webp', width: 1200, height: 1500, label: 'ESTAMPAS', sub: 'SERVICO 05' },
  { name: 'servico-drops.webp', width: 1200, height: 1500, label: 'DROPS', sub: 'SERVICO 06' },

  { name: 'case-01.webp', width: 1200, height: 1500, label: 'CS 001', sub: 'CASE' },
  { name: 'case-02.webp', width: 1200, height: 1500, label: 'CS 002', sub: 'CASE' },
  { name: 'case-03.webp', width: 1200, height: 1500, label: 'CS 003', sub: 'CASE' },
  { name: 'case-04.webp', width: 1200, height: 1500, label: 'CS 004', sub: 'CASE' },
  { name: 'case-05.webp', width: 1200, height: 1500, label: 'CS 005', sub: 'CASE' },
  { name: 'case-06.webp', width: 1200, height: 1500, label: 'CS 006', sub: 'CASE' },
];

await mkdir(OUT, { recursive: true });

for (const file of files) {
  const buffer = Buffer.from(svg(file));
  await sharp(buffer)
    .webp({ quality: 72 })
    .toFile(path.join(OUT, file.name));
  console.log('gerado:', file.name);
}

console.log(`\n${files.length} placeholders em /public/images`);
