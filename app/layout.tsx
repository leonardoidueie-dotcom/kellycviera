import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}
