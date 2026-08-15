# Kelly Brandão · Marcenaria

Site institucional e catálogo da marcenaria Kelly Brandão (Minas Gerais).
Sem carrinho: todo orçamento é fechado no WhatsApp.

## Rodar

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Design system: http://localhost:3000/styleguide

## Estrutura

```
app/            rotas (App Router)
  globals.css   ← tokens do design system (bloco @theme)
  styleguide/   página que mostra todos os tokens aplicados
components/ui/  Button, Card, Reveal
lib/            site.ts (dados da marca), tokens.ts (índice dos tokens), utils.ts
data/           pecas.ts (catálogo)
public/images/  fotos das peças
public/video/   vídeo de apresentação
```

## Design system

Os valores de verdade vivem em `app/globals.css`, dentro do bloco `@theme` —
no Tailwind v4 é ali que fica a configuração do tema (não existe mais
`tailwind.config.js` por padrão). O bloco gera as variáveis CSS e as classes
utilitárias ao mesmo tempo.

`lib/tokens.ts` é o índice legível desses tokens e alimenta a `/styleguide`.

Regra da casa: **nenhuma cor, tamanho, raio ou tempo solto no código.** Se um
valor não está na `/styleguide`, ele não entra em componente.

| Token          | Valor     | Uso                                  |
| -------------- | --------- | ------------------------------------ |
| `fundo-cal`    | `#F7F4EF` | base do site, off-white quente       |
| `madeira-mel`  | `#C8853F` | destaque principal, cor das peças    |
| `nogueira`     | `#6B4226` | títulos e texto forte                |
| `folha`        | `#2F4A3C` | jardim vertical, com parcimônia      |
| `grafite`      | `#1C1A17` | rodapé e texto escuro                |
| `areia`        | `#E4DBCD` | bordas, divisórias, superfície 2     |

Tipografia: Fraunces (display) + Inter (corpo), carregadas por `next/font`.
Raio entre 4 e 6px. Sombra quase nenhuma — os blocos se separam por espaço e
pela linha fina em areia.

Movimento discreto: `Reveal` faz fade + subida de 12px na entrada do scroll, e
a foto da peça amplia devagar no hover (`moldura-peca` + `zoom-madeira`) para
revelar o veio da madeira. Tudo respeita `prefers-reduced-motion`.

## Pendências

- Trocar o número do WhatsApp em `lib/site.ts` pelo número real da loja.
- Substituir as texturas de espera em `public/images` pelas fotos reais.
