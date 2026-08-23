import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import './globals.css';
import { site } from '@/site.config';
import SmoothScroll from '@/components/providers/SmoothScroll';
import Cursor from '@/components/ui/Cursor';
import Header from '@/components/layout/Header';

/* TIPOGRAFIA — troque as famílias aqui.
   display = títulos (geométrica pesada) | body = textos corridos. */
const display = Archivo({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
};

/* SEO — os textos vêm de site.config.ts → seo */
export const metadata: Metadata = {
  metadataBase: new URL(site.seo.siteUrl),
  title: {
    default: site.seo.title,
    template: `%s — ${site.brand.name}`,
  },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.seo.siteUrl,
    siteName: site.brand.name,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: site.brand.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage],
  },
  robots: { index: true, follow: true },
  category: 'shopping',
};

/* Schema LocalBusiness — ajuda o site a aparecer em buscas locais. */
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: site.brand.name,
  legalName: site.legal.companyName,
  description: site.seo.description,
  url: site.seo.siteUrl,
  telephone: site.contact.phoneHref.replace('tel:', ''),
  email: site.contact.email,
  image: `${site.seo.siteUrl}${site.seo.ogImage}`,
  priceRange: site.seo.priceRange,
  foundingDate: String(site.brand.foundedYear),
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.location.street,
    addressLocality: site.location.city,
    addressRegion: site.location.state,
    postalCode: site.location.postalCode,
    addressCountry: site.location.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: site.location.latitude,
    longitude: site.location.longitude,
  },
  areaServed: `${site.location.city}, ${site.location.state}`,
  sameAs: [site.contact.instagram],
  openingHours: 'Mo-Fr 10:00-19:00',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Skip link: primeiro item focável da página */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-accent focus:px-6 focus:py-3 focus:font-sans focus:text-sm focus:uppercase focus:tracking-widest focus:text-ink"
        >
          Pular para o conteúdo
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        <SmoothScroll>
          <Cursor />
          <Header />
          <main id="conteudo">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
