# Tok Rústico

Site da loja Tok Rústico — móveis em madeira maciça e de demolição.
Next.js (App Router) + Tailwind, estética *quiet luxury*: fundo quente
quase preto, acentos em dourado envelhecido, títulos em Cormorant
Garamond e corpo em Inter.

## Rodar na sua máquina

```bash
npm install
npm run dev     # http://localhost:3000
```

## Publicar na internet (Vercel, grátis)

Não precisa de terminal.

1. Entre em **https://vercel.com** e clique em *Sign up* → *Continue with
   GitHub*.
2. **Add New… → Project** e escolha o repositório `kellycviera`.
3. Em **Framework Preset**, o Next.js é detectado sozinho. Não mexa em
   mais nada.
4. **Deploy**. Em dois ou três minutos sai um endereço tipo
   `kellycviera.vercel.app`.

A partir daí, todo `git push` publica de novo sozinho.

> Se o projeto estiver numa branch em vez da principal, escolha-a em
> *Settings → Git → Production Branch*.

## Onde se muda o conteúdo

**`src/lib/loja.ts`** concentra tudo o que é editável: telefone,
Instagram, endereço, horário e a lista de peças com medidas, descrição e
preço. Trocar qualquer coisa do site é mexer só nesse arquivo.

Campos vazios simplesmente somem do site — é assim que o endereço fica
escondido até o verdadeiro chegar.

## Estrutura da página

| Seção | Arquivo |
|---|---|
| Topo com o vídeo de apresentação | `src/components/hero-apresentacao.tsx` |
| Faixa de assinatura e "O ofício" | `src/app/page.tsx` |
| A mesa em 3D | `src/components/secao-mesa.tsx` |
| Catálogo de peças | `src/components/catalogo.tsx` |
| Pedido de orçamento | `src/components/orcamento.tsx` |
| Cabeçalho e rodapé | `src/components/site-header.tsx`, `site-footer.tsx` |

## A mesa em 3D

`src/components/mesa-viewer.tsx` detecta WebGL e carrega a cena com
`next/dynamic` + `{ ssr: false }`. A mesa é construída com primitivas —
tampo de 220 × 100 × 8 cm em três pranchas com friso e travamento
perimetral, sobre pés que fecham um retângulo entre o chão e o tampo.

A cor da madeira sai da foto real da peça
(`public/texturas/madeira-tampo.jpg`, extraída da foto da loja) e o
relevo vem de um mapa de normais CC0 do Poly Haven. A cena é iluminada
pela própria foto do salão.

`MesaShowcase` escolhe sozinho o que mostrar, na ordem de realismo:
vídeo em órbita da peça, sequência de fotos, e por fim o 3D. Publicar um
`public/modelo/mesa.glb` substitui o modelo construído por código.

## Arquivos que o site adota sozinho

| Caminho | O que acontece |
|---|---|
| `public/fotos/loja.jpg` | vira o fundo do topo e a luz da cena 3D |
| `public/fotos/logo.jpg` | logomarca no cabeçalho e no rodapé |
| `public/video/mesa-360.mp4` | vira o giro arrastável da mesa |
| `public/mesa-360/frame-01.jpg…` | giro em sequência de fotos |
| `public/modelo/mesa.glb` | substitui a mesa 3D |
| `public/texturas/pbr/*` | relevo e cor da madeira |

As instruções de cada um estão em `docs/`.
