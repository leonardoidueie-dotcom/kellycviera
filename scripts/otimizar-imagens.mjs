/**
 * OTIMIZADOR DE IMAGENS
 * Pega as fotos originais (JPG/PNG/HEIC exportado, do fotógrafo ou do celular)
 * e devolve arquivos .webp leves, no tamanho certo, dentro de /public/images.
 *
 * COMO USAR
 *   1) jogue as fotos originais na pasta  midia-original/
 *   2) rode:  npm run otimizar-imagens
 *   3) os arquivos saem em  public/images/  com o mesmo nome, em .webp
 *
 * Se o nome do arquivo bater com um dos nomes usados pelo site
 * (hero, servico-camisetas, case-01...), ele já substitui o placeholder.
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const IN = path.join(process.cwd(), 'midia-original');
const OUT = path.join(process.cwd(), 'public', 'images');

// Largura máxima por tipo de arquivo (mais que isso é desperdício de banda).
const RULES = [
  { match: /^hero/i, width: 2000, quality: 70 },
  { match: /^og/i, width: 1200, quality: 78 },
  { match: /^case/i, width: 1400, quality: 72 },
  { match: /^servico/i, width: 1400, quality: 72 },
  { match: /^menu/i, width: 800, quality: 72 },
  { match: /^logo/i, width: 600, quality: 90 },
  { match: /.*/, width: 1600, quality: 72 },
];

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

let files;
try {
  files = await readdir(IN);
} catch {
  console.error(
    `\nA pasta "midia-original/" não existe.\n` +
      `Crie ela na raiz do projeto, jogue suas fotos lá dentro e rode de novo.\n`,
  );
  process.exit(1);
}

const images = files.filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));

if (images.length === 0) {
  console.log('Nenhuma imagem encontrada em midia-original/. Nada a fazer.');
  process.exit(0);
}

await mkdir(OUT, { recursive: true });

let totalBefore = 0;
let totalAfter = 0;

for (const file of images) {
  const input = path.join(IN, file);
  const base = path.parse(file).name;
  const rule = RULES.find((r) => r.match.test(base));
  const output = path.join(OUT, `${base}.webp`);

  const before = (await stat(input)).size;

  await sharp(input)
    .rotate() // respeita a orientação da foto
    .resize({ width: rule.width, withoutEnlargement: true })
    .webp({ quality: rule.quality })
    .toFile(output);

  const after = (await stat(output)).size;
  totalBefore += before;
  totalAfter += after;

  console.log(`${file}  ${kb(before)}  ->  ${base}.webp  ${kb(after)}  (máx ${rule.width}px)`);
}

const economia = Math.round((1 - totalAfter / totalBefore) * 100);
console.log(`\n${images.length} imagem(ns). ${kb(totalBefore)} -> ${kb(totalAfter)} (-${economia}%).`);
console.log('Confira o resultado em public/images e ajuste os caminhos em site.config.ts.');
