# GUIA PASSO A PASSO

Dois guias em um arquivo:

- **Parte 1 — rodar o site** na sua máquina, do zero.
- **Parte 2 — deixar com a cara da marca** (logo, fotos, vídeo, cores).
- **Parte 3 — otimizar e publicar**, medindo o resultado.
- **Parte 4 — checklist final** antes de colocar no ar.

> Sobre o site de referência: o domínio `digitalists.at` está **bloqueado pelo proxy
> deste ambiente**, então não consegui abrir a página para comparar tela a tela.
> A estrutura aqui foi montada a partir do briefing que você mandou (que descreve
> exatamente aquela estrutura). Se quiser paridade fina de algum detalhe, me manda
> um print da seção e eu ajusto.

---

# PARTE 1 — RODAR O SITE

### Passo 1. Instalar o Node.js

Baixe a versão **LTS** em <https://nodejs.org> (serve Windows, Mac ou Linux).
Depois de instalar, abra o terminal e confira:

```bash
node -v    # precisa mostrar v18.18 ou maior (ideal: v20 ou v22)
npm -v
```

### Passo 2. Baixar o projeto

```bash
git clone https://github.com/leonardoidueie-dotcom/kellycviera.git
cd kellycviera
git checkout claude/institutional-one-page-site-d7tzh8
```

> Se você não usa git, dá para baixar o ZIP pelo GitHub (botão **Code → Download ZIP**),
> descompactar e abrir a pasta no terminal.

### Passo 3. Instalar as dependências

```bash
npm install
```

Roda uma vez só (ou quando alguém mudar o `package.json`). Demora ~30s.

### Passo 4. Subir o site

```bash
npm run dev
```

Abra <http://localhost:3000>. Pronto: o site está rodando na sua máquina.

Enquanto esse comando estiver ligado, **qualquer arquivo que você salvar aparece na
hora no navegador** — não precisa reiniciar nada. Para parar: `Ctrl + C` no terminal.

### Passo 5. Testar como vai ficar publicado

O modo `dev` é mais lento de propósito (fica recompilando). Para ver a velocidade real:

```bash
npm run build     # gera a versão de produção
npm run start     # sobe essa versão em http://localhost:3000
```

**Sempre rode `npm run build` antes de publicar.** Se ele der erro, o site não sobe.

### Problemas comuns

| Erro | O que fazer |
| --- | --- |
| `EADDRINUSE` / porta 3000 ocupada | `PORT=3001 npm run dev` |
| Tela branca depois de muita edição | pare, rode `rm -rf .next` e `npm run dev` de novo |
| `Cannot find module` | rode `npm install` de novo |
| Node antigo | instale a versão LTS pelo nodejs.org |

---

# PARTE 2 — COLOCAR A CARA DA MARCA

Ordem recomendada: **logo → cores → fotos → vídeo → textos**.
Quase tudo passa pelo arquivo [`site.config.ts`](./site.config.ts) — procure por `TROQUE`.

### Passo 1. Logo

1. Exporte o logo em **SVG** (ideal) ou PNG com fundo transparente, ≥ 400px de largura.
2. Salve em `public/images/logo.svg`.
3. Abra `site.config.ts` e troque:

```ts
logoSrc: null,                    // antes
logoSrc: '/images/logo.svg',      // depois
```

Salve. O logo aparece no header, no rodapé e no menu.

> **Dica:** use uma versão **monocromática branca** do logo. O fundo do site é quase
> preto e um logo colorido ou com fundo branco quebra o visual. O favicon fica em
> `app/icon.svg` (edite as cores lá dentro, é um SVG de texto).

### Passo 2. Nome e textos da marca

Em `site.config.ts`, bloco `brand`:

```ts
name: 'ESTILO DE RUA',   // nome que aparece no header e no rodapé
shortName: 'EDR',        // sigla do logo desenhado
tagline: 'Streetwear autoral',
heroLine: 'Roupa de rua feita para quem ocupa a rua.',   // frase gigante do topo
positioning: '...',                                       // frase única da seção 01
```

A `heroLine` é animada **palavra por palavra** — frases de 6 a 10 palavras ficam
melhores. A última palavra sai na cor de destaque automaticamente.

### Passo 3. Cores

Arquivo `app/globals.css`, bem no topo:

```css
--accent-rgb: 143 184 232;   /* #8FB8E8 */
```

O valor é **R G B separados por espaço** (não é hexadecimal). Para converter:
`#8FB8E8` → `143 184 232`. Qualquer conversor online de HEX para RGB resolve.

Regras que valem a pena respeitar:
- **uma cor de destaque só** — é o que dá o ar caro do layout;
- **escolha um tom claro**, porque ela vive sobre fundo quase preto. Tom escuro
  reprova no contraste (acessibilidade) e some na tela do celular no sol;
- se mudar o fundo (`--ink-rgb`), ajuste também o `themeColor` em `app/layout.tsx`.

### Passo 4. Fotos

**4.1 — Quais fotos o site usa**

| Arquivo em `public/images/` | Onde aparece | Formato ideal |
| --- | --- | --- |
| `hero.webp` | fundo do topo (e poster do vídeo) | retrato/vertical, ~2000px de largura |
| `servico-camisetas.webp` … (6) | hover da lista + blocos de detalhe | 4:5 |
| `case-01.webp` … `case-06.webp` | cards e modal dos cases | 4:5 |
| `menu-01.webp` … `menu-05.webp` | miniaturas do menu fullscreen | 4:5 |
| `easter-egg.webp` | ilustração do fim da página | quadrada |
| `og.webp` | preview no WhatsApp/Instagram | **1200×630** |

**4.2 — Otimizar e trocar (o jeito automático)**

1. Jogue as fotos originais (as pesadas mesmo, direto do fotógrafo) na pasta
   `midia-original/`, **com o nome do arquivo que elas vão substituir**
   (`hero.jpg`, `case-01.jpg`, `servico-calcas.jpg`…).
2. Rode:

```bash
npm run otimizar-imagens
```

3. O script redimensiona, comprime e salva em `public/images/` no formato `.webp`.
   Ele mostra quanto cada arquivo emagreceu:

```
hero.jpg  4210 kB  ->  hero.webp  186 kB  (máx 2000px)
```

A pasta `midia-original/` é só seu material bruto — ela não vai para o site publicado.

**4.3 — O jeito manual**

Se preferir, exporte você mesmo em WebP (Photoshop, Figma, ou <https://squoosh.app>)
e salve direto em `public/images/` com o nome do arquivo que quer substituir.

**4.4 — Descrição das fotos (não pule)**

Para cada foto trocada, atualize o `alt` correspondente em `site.config.ts`.
É o texto que o Google lê e que o leitor de tela fala. Descreva o que aparece:
*"Camiseta oversized azul clara com estampa de cogumelos nas costas"* — não
*"foto 1"*.

### Passo 5. Vídeo

O site tem **dois lugares** para vídeo, os dois configurados em `site.config.ts` → `media`:

- `media.hero` — vídeo de fundo do topo, sem som, em loop, por cima da foto;
- `media.showreel` — bloco de vídeo em largura cheia, com botão de som e de pausa.

**5.1 — Como exportar**

| Item | Recomendação |
| --- | --- |
| Formato | **MP4 (H.264 + AAC)** — obrigatório, é o único que toca no iPhone |
| Extra (opcional) | WebM (VP9) — mais leve no Chrome/Android |
| Duração | 8 a 20 segundos, cortado para dar loop |
| Resolução | 1080p já basta; para o hero, 720p vertical resolve |
| Áudio | **hero sem áudio nenhum**; showreel pode ter (começa mudo) |
| Peso | hero até ~3 MB, showreel até ~8 MB |

**5.2 — Comprimir com ffmpeg** (instale de <https://ffmpeg.org>):

```bash
# MP4 leve, sem áudio, para o fundo do hero
ffmpeg -i original.mov -vf "scale=-2:1080" -c:v libx264 -crf 28 -preset slow \
       -movflags +faststart -an public/video/hero.mp4

# WebM opcional (mais leve ainda)
ffmpeg -i original.mov -vf "scale=-2:1080" -c:v libvpx-vp9 -crf 36 -b:v 0 \
       -an public/video/hero.webm

# Poster: o primeiro quadro vira a imagem que aparece antes do vídeo carregar
ffmpeg -i public/video/hero.mp4 -vframes 1 -q:v 2 midia-original/hero.jpg
npm run otimizar-imagens        # transforma esse quadro em hero.webp
```

> `-movflags +faststart` é o que faz o vídeo começar a tocar antes de baixar inteiro.
> `-crf`: quanto maior o número, mais leve e mais borrado (26–30 é uma boa faixa).

**5.3 — Apontar no config**

```ts
media: {
  hero: {
    enabled: true,
    mp4: '/video/hero.mp4',      // <- preencha depois de exportar
    webm: '/video/hero.webm',    // opcional; deixe '' se não tiver
    poster: '/images/hero.webp',
  },
  ...
}
```

Hoje o `mp4` está vazio e o site usa um **vídeo de exemplo em WebM**
(`hero-placeholder.webm`) só para você ver o efeito funcionando. Ele não toca no
iPhone — troque pelo MP4 antes de publicar. Para desligar o vídeo e ficar só com a
foto: `enabled: false`.

**5.4 — Regras que o site já cumpre sozinho**

- O vídeo só começa a tocar **quando entra na tela** e pausa quando sai.
- Fica sempre **mudo no autoplay** (senão o navegador bloqueia).
- Quem tem "reduzir movimento" ativado no celular **não recebe vídeo em movimento**.
- A foto (`poster`) carrega primeiro, então o site nunca aparece preto esperando vídeo.

### Passo 6. Serviços, cases, números e clientes

Tudo em `site.config.ts`, cada bloco é uma lista. Para **adicionar** um serviço ou
case, copie um item inteiro e cole no fim da lista — a numeração (`01`, `CS 007`)
se ajusta sozinha. Para **remover**, apague o item.

Cada case tem `client`, `title`, `year`, `services`, `description`, `results`,
`image` e `alt`. Cada serviço tem `title`, `short` (a linha da lista), `description`
(o bloco de detalhe) e `bullets`.

### Passo 7. Contato e SEO

Ainda no `site.config.ts`:

```ts
contact: { phoneHref: 'tel:+5511...', whatsappHref: 'https://wa.me/55...', email: '...' },
seo:     { siteUrl: 'https://seudominio.com.br', title: '...', description: '...' },
location:{ city: '...', state: '...', timeZone: 'America/Sao_Paulo', street: '...' },
```

- O `whatsappHref` já leva mensagem pronta: edite o texto depois de `?text=`.
- O `timeZone` alimenta o **relógio ao vivo** do topo.
- `location` alimenta o **schema LocalBusiness** (o que faz aparecer na busca local).

---

# PARTE 3 — OTIMIZAR E PUBLICAR

### Passo 1. Medir antes de mexer

```bash
npm run build && npm run start
```

Abra <http://localhost:3000> no Chrome → `F12` → aba **Lighthouse** → *Analyze page load*
(escolha **Mobile**). Guarde as notas: é o seu "antes".

### Passo 2. Atacar o LCP (a métrica que mais pesa)

O LCP aqui é a **foto do hero**. Alvo: abaixo de 2,5s.

- [ ] `public/images/hero.webp` **abaixo de 300 kB** (confira com `ls -lh public/images`)
- [ ] hero em `.webp` ou `.avif`, nunca `.png`
- [ ] não trocar a foto do hero por vídeo: o vídeo entra **por cima**, depois

### Passo 3. Emagrecer as imagens

```bash
npm run otimizar-imagens          # se as originais estiverem em midia-original/
ls -lh public/images              # confira o resultado
```

Alvos por arquivo: hero ≤ 300 kB · cases e serviços ≤ 150 kB cada ·
miniaturas do menu ≤ 80 kB · og.webp ≤ 200 kB.

O resto (AVIF/WebP na entrega, `lazy loading`, tamanho por breakpoint) o `next/image`
já faz sozinho — não precisa configurar nada.

### Passo 4. Segurar o peso do vídeo

- [ ] hero ≤ 3 MB · showreel ≤ 8 MB
- [ ] exportado com `-movflags +faststart`
- [ ] hero **sem faixa de áudio** (`-an`) — economiza peso e evita bloqueio de autoplay
- [ ] em conexão ruim, teste com o Chrome em *Network → Slow 4G*: o site tem que
      ficar utilizável **só com a foto**, sem esperar o vídeo

Se o vídeo pesar demais e você não quiser cortar qualidade, desligue no mobile:
`media.hero.enabled = false` já resolve o caso extremo.

### Passo 5. Conferir no celular de verdade

Com `npm run dev` rodando, descubra o IP da sua máquina e abra no celular
(mesma rede Wi-Fi): `http://192.168.x.x:3000`. Confira:

- [ ] nada corta ou vaza para os lados (rolagem horizontal só dentro do carrossel)
- [ ] os cases deslizam com o dedo e "encaixam" (snap)
- [ ] o menu abre, fecha e navega
- [ ] o formulário abre o teclado certo em cada campo

### Passo 6. Acessibilidade (rápido e obrigatório)

- [ ] navegue o site inteiro **só com Tab**: o contorno azul precisa estar sempre visível
- [ ] `Esc` fecha o menu e o modal de case
- [ ] toda foto trocada teve o `alt` atualizado
- [ ] se você mudou a cor de destaque, teste o contraste dela sobre `#0D0D0D`
      em <https://webaim.org/resources/contrastchecker/> (mire em 4.5:1)

### Passo 7. SEO local

- [ ] `seo.siteUrl` com o domínio final (alimenta canonical, Open Graph e sitemap)
- [ ] `og.webp` com o logo e uma foto forte (é o que aparece no WhatsApp)
- [ ] endereço, telefone e coordenadas certos em `location` (schema LocalBusiness)
- [ ] depois de publicar: cadastre o domínio no **Google Search Console** e envie
      `https://seudominio.com.br/sitemap.xml`

### Passo 8. Publicar (Vercel — caminho mais curto)

1. Suba o projeto para o GitHub (já está: branch `claude/institutional-one-page-site-d7tzh8`).
2. Crie conta em <https://vercel.com> e clique em **Add New → Project**.
3. Escolha o repositório. A Vercel reconhece Next.js sozinha — **não mexa em nada**.
4. **Deploy**. Em ~1 minuto sai uma URL `.vercel.app`.
5. Em **Settings → Domains**, aponte seu domínio (a Vercel mostra o que configurar no
   registrador: um registro `A` ou `CNAME`).
6. Cada `git push` na branch republica o site automaticamente.

### Passo 9. Ligar o formulário (senão as mensagens se perdem)

Hoje o formulário valida e responde "enviado", mas **não manda e-mail**.
Abra `app/api/contact/route.ts` e substitua o bloco marcado com `TROQUE ESTE BLOCO`.
Caminho mais simples (Resend):

```bash
npm install resend
```

```ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'site@seudominio.com.br',
  to: 'contato@seudominio.com.br',
  subject: `Novo contato: ${data.assunto}`,
  text: `${nome} — ${email} — ${data.telefone}\n\n${mensagem}`,
});
```

Guarde a chave em `.env.local` (local) e em **Settings → Environment Variables** (Vercel).
Nunca escreva a chave no código.

---

# PARTE 4 — CHECKLIST FINAL

- [ ] nenhum `TROQUE` pendente em `site.config.ts`
- [ ] logo da marca no lugar (`brand.logoSrc`)
- [ ] todas as fotos reais, otimizadas, com `alt` escrito
- [ ] `hero.mp4` exportado e apontado no config (o placeholder não toca no iPhone)
- [ ] `og.webp` 1200×630 com a cara da marca
- [ ] telefone, WhatsApp, e-mail, endereço e CNPJ corretos
- [ ] `seo.siteUrl` com o domínio final
- [ ] formulário enviando de verdade
- [ ] política de privacidade revisada (`app/politica-de-privacidade/page.tsx` é rascunho)
- [ ] `npm run build` sem erro
- [ ] Lighthouse mobile rodado depois de tudo pronto
