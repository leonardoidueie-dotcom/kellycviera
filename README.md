# ESTILO DE RUA — site institucional one-page

Site one-page, animado, feito **do zero** em Next.js — sem WordPress, sem page builder,
sem template comprado. Todo o conteúdo em português do Brasil.

> **Nome, cidade, telefone, cores, fotos e vídeo são placeholders.** Tudo isso se
> troca em um único arquivo: [`site.config.ts`](./site.config.ts). Procure por `TROQUE`.

> 👉 **Se você quer o passo a passo mastigado** — rodar na sua máquina, trocar logo,
> fotos e vídeo, otimizar e publicar — leia o **[GUIA.md](./GUIA.md)**.
> Este README é a referência técnica; o GUIA é o roteiro.

---

## 1. Rodando o projeto

```bash
npm install          # instala as dependências
npm run dev          # ambiente de desenvolvimento em http://localhost:3000
npm run build        # build de produção
npm run start        # sobe o build de produção
npm run placeholders     # regera as imagens de exemplo em /public/images
npm run otimizar-imagens # comprime as fotos de midia-original/ para public/images
```

Requisitos: Node.js 18.18+ (testado no Node 22).

## 2. Stack

| Peça | Para quê |
| --- | --- |
| **Next.js 15 (App Router)** | estrutura, rotas, SEO, otimização de imagem |
| **TypeScript** | segurança nos textos e dados do `site.config.ts` |
| **Tailwind CSS** | estilo utilitário, com tokens da marca |
| **GSAP + ScrollTrigger** | todas as animações de scroll |
| **Lenis** | smooth scroll global (sincronizado com o ScrollTrigger) |
| **sharp** | geração dos placeholders e o script de otimização de imagens |

## 3. Onde editar o quê

### 3.1 Textos, números, links, WhatsApp, endereço
**Arquivo:** `site.config.ts` — é a central de tudo:

| Bloco | O que controla |
| --- | --- |
| `brand` | nome, sigla, **arquivo do logo**, frase do hero, posicionamento, ano |
| `location` | cidade, UF, **fuso do relógio ao vivo**, endereço, coordenadas |
| `contact` | telefone, link do WhatsApp (com mensagem pré-pronta), e-mail, Instagram |
| `seo` | title, description, palavras-chave, imagem de Open Graph, domínio |
| `media` | vídeo do hero e vídeo do showreel (MP4/WebM + poster) |
| `menu` | itens do menu fullscreen + miniatura de cada um |
| `services` | lista de serviços (título, resumo, texto longo, imagem, selos) |
| `stats` | números do contador animado |
| `cases` | cases do scroll horizontal e do modal |
| `clients` | nomes/logos do marquee |
| `easterEgg` | o bloco de humor no fim da página |
| `legal` | razão social, CNPJ, link da política de privacidade |

Adicionar ou remover um serviço/case é só mexer na lista: a numeração
(`01`, `02`…, `CS 001`, `CS 002`…) é gerada automaticamente.

### 3.2 Cores
**Arquivo:** `app/globals.css`, bloco `:root` (topo do arquivo):

```css
--ink-rgb: 13 13 13;        /* fundo quase preto  #0D0D0D */
--paper-rgb: 245 245 245;   /* texto branco       #F5F5F5 */
--accent-rgb: 143 184 232;  /* COR DE DESTAQUE    #8FB8E8 */
```

Os valores são **canais R G B separados por espaço** (assim o Tailwind consegue
aplicar opacidade, ex.: `text-accent/60`). Trocando `--accent-rgb`, mudam de uma
vez: cursor, hovers, botões, marcadores de erro do formulário e todos os detalhes.
A paleta é propositalmente de **uma cor só** — não adicione uma segunda.

Também troque o `themeColor` em `app/layout.tsx` e a cor do favicon em `app/icon.svg`
se mudar o fundo.

### 3.3 Tipografia
**Arquivo:** `app/layout.tsx` (topo). Hoje: `Archivo` (títulos, pesos 700–900) e
`Inter` (texto). Troque pelas famílias que quiser via `next/font/google` — os nomes
de variável (`--font-display`, `--font-body`) devem continuar iguais.
Os tamanhos gigantes (`text-mega`, `text-huge`, `text-big`) ficam em `tailwind.config.ts`.

### 3.4 Logo

Coloque o arquivo em `public/images/logo.svg` (SVG monocromático branco é o ideal)
e aponte em `site.config.ts`:

```ts
logoSrc: '/images/logo.svg',   // null = usa o logo desenhado em components/ui/Logo.tsx
```

O favicon fica em `app/icon.svg` — é um SVG de texto, dá para editar as cores direto.

### 3.5 Vídeo

Bloco `media` do `site.config.ts`. Arquivos em `public/video/`.

```ts
media: {
  hero:     { enabled: true, mp4: '/video/hero.mp4', webm: '', poster: '/images/hero.webp' },
  showreel: { enabled: true, mp4: '/video/showreel.mp4', webm: '', poster: '...' },
}
```

- **Exporte sempre em MP4 (H.264)** — é o único formato que toca no Safari/iPhone.
  O WebM é opcional e serve só para economizar banda no Chrome.
- Hoje o `mp4` está vazio e roda um WebM de exemplo (`hero-placeholder.webm`), só
  para o efeito ficar visível. Troque antes de publicar.
- Os vídeos tocam **mudos, em loop, só quando estão na tela**, e não tocam para quem
  ativou "reduzir movimento". O poster (foto) carrega antes, então o LCP não depende
  do vídeo. Comandos de compressão prontos estão no [GUIA.md](./GUIA.md), Parte 2, Passo 5.
- `enabled: false` desliga o vídeo (o hero fica só com a foto; a seção de showreel some).

### 3.6 Imagens
Todas as imagens vivem em `public/images/` e são **placeholders gerados por script**.

Para colocar as fotos reais, há dois caminhos:
1. **Mais simples:** salve seu arquivo com o mesmo nome, sobrescrevendo o placeholder
   (ex.: `public/images/servico-camisetas.webp`).
2. **Mais organizado:** coloque o arquivo com o nome que quiser e aponte o novo
   caminho em `site.config.ts`.

Arquivos usados:

| Arquivo | Onde aparece | Proporção sugerida |
| --- | --- | --- |
| `hero.webp` | fundo do hero (parallax) | retrato, ≥ 1600px de largura |
| `menu-01…05.webp` | miniaturas do menu fullscreen | 4:5 |
| `servico-*.webp` | hover da lista + blocos de detalhe | 4:5 |
| `case-01…06.webp` | cards e modal dos cases | 4:5 |
| `easter-egg.webp` | ilustração do bloco final | quadrada, fundo livre |
| `og.webp` | pré-visualização no WhatsApp/redes | 1200×630 |

Use **WebP ou AVIF**. O `next/image` já entrega AVIF/WebP, faz `lazy loading` e
gera os tamanhos por breakpoint — só o hero é `priority` (para o LCP).
**Sempre preencha o `alt`** correspondente em `site.config.ts`.

Logos de clientes: em `clients`, troque `logo: null` por `logo: '/images/logo-cliente.svg'`.
Enquanto for `null`, o nome aparece como wordmark de texto.

#### Jeito automático de otimizar as fotos

Jogue as fotos originais em `midia-original/` **com o nome do arquivo que elas vão
substituir** (`hero.jpg`, `case-01.jpg`…) e rode:

```bash
npm run otimizar-imagens
```

O script (`scripts/otimizar-imagens.mjs`) redimensiona, comprime e grava em
`public/images/` como `.webp`, mostrando quanto cada arquivo emagreceu.
A pasta `midia-original/` não vai para o site publicado.

### 3.7 Formulário — para receber as mensagens de verdade
**Arquivo:** `app/api/contact/route.ts`. Hoje ele valida e responde OK, mas só
registra no log do servidor. Há um bloco marcado com `TROQUE ESTE BLOCO` mostrando
onde plugar Resend/SendGrid, um webhook (Zapier, Make, n8n) ou um CRM.
Guarde chaves em `.env.local` — nunca no código.
As regras de validação do lado do navegador estão em
`components/sections/ContactForm.tsx`, na função `validate()`.

## 4. Estrutura da página

A ordem das seções está em `app/page.tsx` — para reordenar, mude a ordem ali.

```
Header fixo (logo + relógio ao vivo + Menu)
 └ Hero                     components/sections/Hero.tsx
 └ Posicionamento           components/sections/Positioning.tsx
 └ Serviços (hover-image)   components/sections/Services.tsx
 └ Detalhe dos serviços     components/sections/ServiceDetails.tsx
 └ Contador animado         components/sections/Counter.tsx
 └ Showreel (vídeo)         components/sections/Showreel.tsx
 └ Cases (scroll horizontal)components/sections/Cases.tsx + CaseModal.tsx
 └ Logos de clientes        components/sections/Clients.tsx
 └ CTA de contato           components/sections/ContactCta.tsx
 └ Formulário               components/sections/ContactForm.tsx
 └ Rodapé                   components/sections/Footer.tsx
 └ Easter egg               components/sections/EasterEgg.tsx
```

## 5. As mecânicas (e onde cada uma mora)

1. **Cursor customizado** — `components/ui/Cursor.tsx`. Círculo com defasagem; cresce
   e vira cor de destaque sobre links; vira "← arraste →" sobre o carrossel de cases.
   Para marcar um elemento: `data-cursor="link" | "view" | "drag"`.
   Desligado no mobile e com *reduced motion*.
2. **Relógio ao vivo** — `components/ui/LiveClock.tsx`, no formato `CIDADE, DD.MM.AA HH:MM`,
   no fuso definido em `location.timeZone`.
3. **Hero animado** — `components/ui/WordReveal.tsx`: cada palavra sobe de baixo com
   blur e stagger, disparado no load. Fundo com parallax lento (ScrollTrigger).
4. **Menu fullscreen** — `components/layout/MenuOverlay.tsx`: abre com máscara
   (`clip-path`), itens em stagger, miniatura no hover e fecha com `ESC`.
5. **Lista de serviços com hover-image** — `components/sections/Services.tsx`:
   a imagem flutua seguindo o cursor e as outras linhas perdem opacidade.
   No mobile, cada linha mostra uma miniatura fixa (não existe hover lá).
6. **Contador animado** — `components/sections/Counter.tsx`: conta de 0 até o valor
   quando entra na viewport.
7. **Cases em scroll horizontal** — `components/sections/Cases.tsx`: no desktop a
   seção é "pinada" e a régua de cards anda na horizontal conforme a página rola.
   No mobile vira carrossel de swipe com snap.
8. **Modal de case com transição contínua** — `components/sections/CaseModal.tsx`:
   medimos o retângulo da imagem no card e o do modal e animamos a diferença
   (técnica FLIP, feita à mão) — a imagem "cresce" do card até o painel.
9. **Marquee de clientes** — `components/sections/Clients.tsx`: loop infinito em CSS,
   pausa no hover.
10. **Formulário** — validação inline com marcador `▲` por campo, `aria-invalid`,
    estado de envio, mensagem de sucesso animada e checkbox de política obrigatório.
11. **Easter egg** — `components/sections/EasterEgg.tsx`, depois do rodapé.

Extra: **vídeo** — `components/ui/BackgroundVideo.tsx` (fundo do hero) e
`components/sections/Showreel.tsx` (bloco de vídeo com som e pausa).

## 6. Acessibilidade

- Skip link ("Pular para o conteúdo") como primeiro item focável.
- Foco sempre visível (contorno na cor de destaque, em `app/globals.css`).
- `alt` em todas as imagens de conteúdo; imagens decorativas com `alt=""`.
- Menu e modal são `role="dialog"` + `aria-modal`, fecham com `ESC` e devolvem o foco.
- Erros de formulário com `role="alert"` e `aria-describedby`; ao enviar com erro,
  o foco vai para o primeiro campo problemático.
- Contraste AA: texto `#F5F5F5` e destaque `#8FB8E8` sobre `#0D0D0D`.
  **Se trocar a cor de destaque, escolha um tom claro** — tons escuros quebram o contraste.
- `prefers-reduced-motion`: Lenis não é instanciado, o pin horizontal não é criado e
  todos os textos aparecem estáticos. O site continua 100% utilizável.

## 7. Performance

- `next/image` com AVIF/WebP, `sizes` por breakpoint e `lazy loading` (só o hero é `priority`).
- Fontes via `next/font` com `display: swap` (sem requisição bloqueante).
- Animações só em `transform`/`opacity`, com `will-change` onde importa.
- Nenhuma biblioteca de UI, carrossel ou ícones: o JS da home fica em torno de 170 kB.
- Vídeo com `preload="none"`, autoplay mudo e play/pause por `IntersectionObserver`:
  só baixa e só toca quando está na tela.
- Meta de LCP < 2,5s: mantenha o `hero.webp` **abaixo de ~300 kB** e o vídeo do hero
  abaixo de ~3 MB ao trocar pelos arquivos reais.

## 8. SEO local

- `title`, `meta description`, Open Graph e Twitter Card em `app/layout.tsx`
  (conteúdo vindo de `site.config.ts → seo`).
- Schema **LocalBusiness** (`ClothingStore`) com endereço, geo, telefone e horário.
- `sitemap.xml` e `robots.txt` gerados em `app/sitemap.ts` e `app/robots.ts`.
- **Antes de publicar:** troque `seo.siteUrl` pelo domínio real — ele alimenta
  canonical, Open Graph e sitemap.

## 9. Deploy

Qualquer host que rode Next.js 15 serve (Vercel é o caminho mais curto: importar o
repositório e dar deploy, sem configuração). Checklist antes de publicar:

- [ ] `site.config.ts` sem nenhum `TROQUE` pendente
- [ ] fotos reais em `public/images` (inclusive `og.webp`)
- [ ] logo da marca em `public/images/logo.svg` + `brand.logoSrc` apontando para ele
- [ ] `hero.mp4` (H.264) exportado — o placeholder em WebM **não toca no iPhone**
- [ ] `seo.siteUrl` com o domínio final
- [ ] envio do formulário plugado em `app/api/contact/route.ts`
- [ ] texto da política de privacidade revisado — hoje `/politica-de-privacidade`
      existe, mas é um **rascunho** (`app/politica-de-privacidade/page.tsx`)
- [ ] `npm run build` passando
