# Tok Rústico

Site da loja Tok Rústico — móveis em madeira maciça e de demolição.
Next.js (App Router) + Tailwind, estética *quiet luxury*: fundo grafite
(`#141210`), acentos em dourado envelhecido (`#C9A227`), títulos em
Cormorant Garamond e corpo em Inter.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

## Visualizador 3D — `<MesaViewer />`

`src/components/mesa-viewer.tsx` é o ponto de entrada: detecta WebGL e carrega
a cena com `next/dynamic` + `{ ssr: false }`.

- `src/components/mesa-viewer-scene.tsx` — cena three.js / react-three-fiber.
  A mesa é construída só com primitivas (nenhum `.glb`): tampo de 220 × 100 × 8 cm
  em 3 pranchas longitudinais com friso e travamento perimetral, sobre dois pés
  em “U” invertido de painéis de 12 cm, recuados 35 cm das pontas. Altura 78 cm.
- `src/lib/wood-texture.ts` — veio de madeira gerado em runtime num canvas 2D
  (cor, bump e roughness). Sem texturas externas.

Interação: `OrbitControls` sem pan, autoRotate lento que pausa no arraste,
3 hotspots com tooltip de acabamento e botões *Girar / Zoom / Resetar vista*.
O enquadramento se adapta ao aspecto do canvas, então a mesa cabe na tela tanto
no mobile (60vh) quanto no desktop (80vh).

Acessibilidade: `prefers-reduced-motion` desliga o giro automático; sem WebGL,
o componente cai para a foto estática `public/mesa-rustica.png`.

> `public/mesa-rustica.png` hoje é um render do próprio visualizador, usado como
> placeholder — troque pela foto real da mesa mantendo o mesmo enquadramento.

## Vídeo

`src/components/video-showcase.tsx` exibe `public/video/tok-rustico.mp4`
(vertical, 720 × 1280) em loop silencioso, com play/pause e som. Só toca quando
entra na viewport e respeita `prefers-reduced-motion`.
