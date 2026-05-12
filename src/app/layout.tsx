import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Libre_Baskerville,
  Manrope,
  Space_Grotesk,
} from "next/font/google";

import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const modernHeadingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading-modern",
});

const modernBodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-modern",
});

const classicHeadingFont = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-heading-classic",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Daniella | Portfolio",
  description: "Portfolio professionnel avec admin Next.js et deploiement Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${headingFont.variable} ${bodyFont.variable} ${modernHeadingFont.variable} ${modernBodyFont.variable} ${classicHeadingFont.variable}`}
      data-theme="light"
      lang="fr"
    >
      <body>{children}</body>
    </html>
  );
}
