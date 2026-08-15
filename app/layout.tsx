import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { BotaoWhatsAppFlutuante } from "@/components/layout/BotaoWhatsAppFlutuante";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-display",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-corpo",
});

export const metadata: Metadata = {
  title: {
    default: `${site.nome} — ${site.descricaoCurta}`,
    template: `%s · ${site.nome}`,
  },
  description: site.descricao,
  openGraph: {
    title: `${site.nome} — ${site.descricaoCurta}`,
    description: site.descricao,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        {/* pt-18/22 compensa a altura do header fixo. */}
        <main id="conteudo" className="flex-1 pt-18 md:pt-22">
          {children}
        </main>
        <Footer />
        <BotaoWhatsAppFlutuante />
      </body>
    </html>
  );
}
