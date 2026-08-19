import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tok Rústico — Móveis em madeira maciça e de demolição",
  description:
    "Mesas, aparadores e bancos em madeira maciça e de demolição, feitos à mão e sob medida. Veja a mesa em 3D, gire e desmonte para conhecer a construção.",
  openGraph: {
    title: "Tok Rústico — Móveis em madeira maciça e de demolição",
    description:
      "Peças únicas em madeira maciça e de demolição, feitas à mão e sob medida.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-grafite">{children}</body>
    </html>
  );
}
