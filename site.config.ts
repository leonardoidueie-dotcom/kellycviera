/* =============================================================================
   SITE.CONFIG.TS — CENTRAL DE EDIÇÃO DO SITE
   -----------------------------------------------------------------------------
   99% dos textos, números, links e caminhos de imagem estão neste arquivo.
   Mexa aqui primeiro. Só entre nos componentes se precisar mudar layout.
   Procure por "TROQUE" para achar rapidamente o que é placeholder.
   ============================================================================= */

export const site = {
  /* --------------------------------------------------------------- MARCA --- */
  brand: {
    name: 'ESTILO DE RUA', // TROQUE: nome da marca
    shortName: 'EDR', // sigla usada no logo e no rodapé
    tagline: 'Streetwear autoral', // TROQUE: segmento em 2 ou 3 palavras
    // Frase de posicionamento do Hero. Cada palavra é animada separadamente.
    heroLine: 'Roupa de rua feita para quem ocupa a rua.',
    // Parágrafo curto abaixo do hero.
    heroSupport:
      'Coleções cápsula, estampas autorais e modelagem oversized produzidas em pequenos lotes — do desenho à peça na mão.',
    // Frase única da seção de posicionamento.
    positioning:
      'Não fazemos moda para vitrine. Fazemos peça para andar, suar, sentar no meio-fio e voltar melhor no dia seguinte.',
    foundedYear: 2019, // TROQUE
    /**
     * LOGO DA MARCA.
     * null  → usa o logo em SVG desenhado no código (components/ui/Logo.tsx).
     * '/images/logo.svg' → usa o arquivo que você colocar em /public/images.
     * Prefira SVG; se for PNG, use fundo transparente e ≥ 400px de largura.
     */
    logoSrc: null as string | null,
  },

  /* ----------------------------------------------------------------- VÍDEO --- */
  /**
   * Os dois vídeos do site. Coloque os arquivos em /public/video.
   * SEMPRE exporte em MP4 (H.264 + AAC) — é o único formato que toca no
   * Safari/iPhone. O WebM é opcional e serve para economizar banda no Chrome.
   * O `poster` é a imagem que aparece antes do vídeo carregar (conta como LCP).
   */
  media: {
    hero: {
      enabled: true, // false = hero só com foto
      // Deixe vazio até ter o arquivo. Ao exportar, coloque '/video/hero.mp4'
      // — o MP4 é obrigatório para o vídeo tocar no iPhone.
      mp4: '',
      webm: '/video/hero-placeholder.webm', // TROQUE pelo seu
      poster: '/images/hero.webp',
    },
    showreel: {
      enabled: true, // false = a seção de vídeo some da página
      mp4: '', // TROQUE por '/video/showreel.mp4' quando tiver o arquivo
      webm: '/video/hero-placeholder.webm', // TROQUE
      poster: '/images/case-01.webp',
      kicker: 'Bastidor',
      title: 'Da mesa de corte até o meio-fio',
      caption: 'Corte, silk, prova e drop — em 40 segundos.',
      alt: 'Vídeo mostrando a produção das peças e o drop na rua',
    },
  },

  /* ------------------------------------------------------------ LOCALIDADE --- */
  // Usado no relógio ao vivo, no SEO local e no schema LocalBusiness.
  location: {
    city: 'São Paulo', // TROQUE: cidade
    state: 'SP', // TROQUE: UF
    timeZone: 'America/Sao_Paulo', // TROQUE se a cidade for de outro fuso
    street: 'Rua Augusta, 1000', // TROQUE: endereço
    district: 'Consolação', // TROQUE: bairro
    postalCode: '01304-001', // TROQUE: CEP
    country: 'BR',
    latitude: -23.5558, // TROQUE
    longitude: -46.6596, // TROQUE
    mapUrl: 'https://maps.google.com/?q=Rua+Augusta+1000+Sao+Paulo', // TROQUE
  },

  /* --------------------------------------------------------------- CONTATO --- */
  contact: {
    phoneLabel: '(11) 90000-0000', // TROQUE
    phoneHref: 'tel:+5511900000000', // TROQUE
    whatsappLabel: 'WhatsApp',
    // TROQUE o número (formato internacional, só dígitos) e o texto pré-preenchido.
    whatsappHref:
      'https://wa.me/5511900000000?text=Oi!%20Vim%20pelo%20site%20e%20quero%20falar%20sobre%20um%20drop.',
    email: 'contato@estilodearua.com.br', // TROQUE
    instagram: 'https://instagram.com/', // TROQUE
    instagramLabel: '@estilodearua', // TROQUE
    openingHours: 'Seg a Sex, 10h às 19h', // TROQUE
  },

  /* ------------------------------------------------------------------- SEO --- */
  seo: {
    // TROQUE pelo domínio real antes de publicar (afeta Open Graph e canonical).
    siteUrl: 'https://www.estilodearua.com.br',
    title: 'ESTILO DE RUA — Streetwear autoral em São Paulo, SP',
    description:
      'Marca de streetwear autoral em São Paulo (SP): camisetas oversized, calças baggy, bonés e coleções cápsula produzidas em pequenos lotes. Drops personalizados para marcas e coletivos.',
    ogImage: '/images/og.webp', // TROQUE: 1200x630
    keywords: [
      'streetwear São Paulo',
      'camiseta oversized',
      'calça baggy',
      'marca de roupa autoral',
      'coleção cápsula',
      'drop personalizado',
    ],
    priceRange: 'R$$',
  },

  /* ----------------------------------------------------------------- MENU --- */
  // `image` aparece como miniatura no hover dentro do menu fullscreen.
  menu: [
    { label: 'Início', href: '#topo', image: '/images/menu-01.webp' },
    { label: 'O que fazemos', href: '#servicos', image: '/images/menu-02.webp' },
    { label: 'Números', href: '#numeros', image: '/images/menu-03.webp' },
    { label: 'Cases', href: '#cases', image: '/images/menu-04.webp' },
    { label: 'Contato', href: '#contato', image: '/images/menu-05.webp' },
  ],

  /* -------------------------------------------------------------- SERVIÇOS --- */
  // A lista aceita quantos itens você quiser: a seção se adapta.
  // `image` é a foto que flutua junto do cursor no hover da linha.
  services: [
    {
      id: 'camisetas',
      title: 'Camisetas oversized',
      short: 'Malha pesada 30.1 penteada, gola reforçada e caimento largo de verdade.',
      description:
        'A peça-base da marca. Modelagem oversized real (não é só dois números acima), malha 30.1 penteada de gramatura alta, gola com ribana dupla e costura reforçada nos ombros. Estampa em silk de alta densidade ou DTF, dependendo da arte.',
      image: '/images/servico-camisetas.webp', // TROQUE pela foto real
      alt: 'Camiseta oversized azul clara com estampa autoral nas costas',
      bullets: ['Malha 30.1 penteada', 'Silk de alta densidade', 'Do P ao GG3'],
    },
    {
      id: 'calcas',
      title: 'Calças baggy',
      short: 'Jeans lavado, cintura alta e barra larga — modelagem própria.',
      description:
        'Jeans com lavagem clara desenvolvida por nós, cintura alta, perna reta e barra ampla que cai sobre o tênis. Rebites e costuras em ponto duplo para aguentar uso pesado. Grade completa e ajuste de barra sob pedido.',
      image: '/images/servico-calcas.webp',
      alt: 'Calça jeans baggy azul clara com barra larga sobre tênis',
      bullets: ['Lavagem exclusiva', 'Costura ponto duplo', 'Ajuste de barra'],
    },
    {
      id: 'headwear',
      title: 'Bonés & headwear',
      short: 'Five panel, trucker e beanie com bordado direto na peça.',
      description:
        'Linha de headwear com five panel em sarja leve, trucker com tela respirável e beanie canelado. Bordado computadorizado ou patch emborrachado, com aba estruturada ou soft conforme a coleção.',
      image: '/images/servico-headwear.webp',
      alt: 'Boné five panel off white com bordado do logo na frente',
      bullets: ['Bordado 3D', 'Aba soft ou estruturada', 'Tamanho único ajustável'],
    },
    {
      id: 'colecoes',
      title: 'Coleções cápsula',
      short: 'Drops curtos, numerados e que não voltam ao estoque.',
      description:
        'Toda coleção nasce de um tema, vira moodboard, prova de estampa e piloto antes de ir para produção. Lotes pequenos, peças numeradas e data de drop anunciada só para a base — quem perdeu, perdeu.',
      image: '/images/servico-colecoes.webp',
      alt: 'Arara com peças de uma coleção cápsula da marca',
      bullets: ['Lotes de 50 a 200 peças', 'Peça numerada', 'Sem reposição'],
    },
    {
      id: 'estampas',
      title: 'Estampas autorais',
      short: 'Ilustração própria: nada de banco de imagem, nada de cópia.',
      description:
        'Todas as artes são desenhadas internamente, do rascunho ao fechamento de arte para produção. Cogumelo, estrela, tipografia deformada — o repertório é da rua, mas o traço é nosso e fica registrado.',
      image: '/images/servico-estampas.webp',
      alt: 'Detalhe de estampa autoral com cogumelos e estrelas',
      bullets: ['Ilustração original', 'Arte fechada para silk', 'Registro de autoria'],
    },
    {
      id: 'drops',
      title: 'Drops personalizados',
      short: 'Uniforme de crew, marca, evento ou coletivo — no nosso padrão.',
      description:
        'Produção sob demanda para marcas, coletivos, eventos e times: mesma modelagem e mesma qualidade da linha principal, com a sua arte. Pedido mínimo baixo, prova física antes de rodar e prazo fechado por contrato.',
      image: '/images/servico-drops.webp',
      alt: 'Peças personalizadas produzidas para um coletivo parceiro',
      bullets: ['Mínimo 30 peças', 'Prova física', 'Prazo por contrato'],
    },
  ],

  /* ------------------------------------------------------------- CONTADOR --- */
  stats: [
    { value: 214, suffix: '', label: 'Drops entregues desde 2019' },
    { value: 38000, suffix: '+', label: 'Peças produzidas e vestidas' },
    { value: 96, suffix: '%', label: 'Clientes que voltam para o próximo drop' },
  ],

  /* ---------------------------------------------------------------- CASES --- */
  // O número "CS 001" é gerado automaticamente pela ordem da lista.
  cases: [
    {
      id: 'cs-001',
      client: 'Coletivo Asfalto',
      title: 'Cápsula "Meio-fio"',
      year: '2025',
      services: ['Coleção cápsula', 'Estampa autoral', 'Lookbook'],
      image: '/images/case-01.webp', // TROQUE
      alt: 'Peças da cápsula Meio-fio fotografadas na rua',
      description:
        'Doze peças desenhadas a partir de fotos de calçada do centro. Silk em quatro cores, numeração manual e drop de 150 unidades esgotado em 48 horas.',
      results: ['150 peças em 48h', '4 cores de silk', '+12k alcance orgânico'],
    },
    {
      id: 'cs-002',
      client: 'Skate Clube Zona Sul',
      title: 'Uniforme de crew',
      year: '2025',
      services: ['Drop personalizado', 'Bordado', 'Headwear'],
      image: '/images/case-02.webp',
      alt: 'Crew de skate usando o uniforme produzido pela marca',
      description:
        'Camiseta oversized e five panel bordado para o time de skate. Tecido testado em sessão real antes de fechar a grade.',
      results: ['80 peças', '2 tipos de bordado', 'Grade P ao GG2'],
    },
    {
      id: 'cs-003',
      client: 'Selo Fungo Records',
      title: 'Merch de lançamento',
      year: '2024',
      services: ['Estampa autoral', 'Camisetas', 'Embalagem'],
      image: '/images/case-03.webp',
      alt: 'Camiseta de merch do selo com estampa de cogumelos',
      description:
        'Arte de cogumelos e estrelas criada junto com a direção do selo, aplicada em silk de alta densidade nas costas.',
      results: ['300 peças', 'Venda em 3 shows', 'Reposição em 2 semanas'],
    },
    {
      id: 'cs-004',
      client: 'Feira Baixo Centro',
      title: 'Linha de feira',
      year: '2024',
      services: ['Coleção cápsula', 'Calças baggy', 'Ativação'],
      image: '/images/case-04.webp',
      alt: 'Estande da marca em feira de rua com araras de roupa',
      description:
        'Linha exclusiva para a feira, com calça baggy em lavagem única e provador montado no estande.',
      results: ['3 dias de feira', '210 peças vendidas', '1 lavagem exclusiva'],
    },
    {
      id: 'cs-005',
      client: 'Quadra 12',
      title: 'Colab de aniversário',
      year: '2023',
      services: ['Colaboração', 'Headwear', 'Conteúdo'],
      image: '/images/case-05.webp',
      alt: 'Boné e camiseta da colaboração de aniversário',
      description:
        'Colab de 5 anos com a quadra do bairro: boné bordado, camiseta e sessão de fotos no próprio local.',
      results: ['2 produtos', 'Sold out no dia', 'Ensaio na quadra'],
    },
    {
      id: 'cs-006',
      client: 'Marca própria',
      title: 'Rebrand e linha base',
      year: '2023',
      services: ['Identidade', 'Linha permanente', 'E-commerce'],
      image: '/images/case-06.webp',
      alt: 'Peças da linha permanente da marca em fundo de concreto',
      description:
        'Reconstrução da identidade da marca e definição da linha permanente que sustenta o calendário de drops.',
      results: ['1 identidade nova', '6 peças permanentes', 'Loja no ar'],
    },
  ],

  /* -------------------------------------------------------------- CLIENTES --- */
  // Marquee infinito. Troque `logo` por um SVG/WebP quando tiver os arquivos.
  clients: [
    { name: 'Coletivo Asfalto', logo: null },
    { name: 'Skate Clube ZS', logo: null },
    { name: 'Fungo Records', logo: null },
    { name: 'Baixo Centro', logo: null },
    { name: 'Quadra 12', logo: null },
    { name: 'Rádio Viela', logo: null },
    { name: 'Bloco Concreto', logo: null },
    { name: 'Studio Meio-fio', logo: null },
    { name: 'Casa Poste', logo: null },
    { name: 'Crew Madrugada', logo: null },
  ],

  /* ------------------------------------------------------------ EASTER EGG --- */
  easterEgg: {
    kicker: 'Ok, você rolou até aqui.',
    title: 'Isso aqui é o fim do site. Sério.',
    text: 'Se chegou até este ponto, ou você é muito curioso ou está adiando alguma coisa. Nos dois casos: manda mensagem. A gente também adia trabalho conversando sobre roupa.',
    cta: 'Chega de rolar, fala com a gente',
    image: '/images/easter-egg.webp', // TROQUE pela ilustração que quiser
    alt: 'Ilustração de um cone de rua usando boné',
  },

  /* ----------------------------------------------------------- LEGAL/RODAPÉ --- */
  legal: {
    companyName: 'Estilo de Rua Confecção LTDA', // TROQUE
    cnpj: '00.000.000/0001-00', // TROQUE
    privacyUrl: '/politica-de-privacidade', // TROQUE quando a página existir
    credits: 'Site desenvolvido sob medida — sem template, sem page builder.',
  },
} as const;

export type Service = (typeof site.services)[number];
export type CaseItem = (typeof site.cases)[number];
