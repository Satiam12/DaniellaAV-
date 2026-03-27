import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

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

export const metadata: Metadata = {
  title: "satiam | Portfolio",
  description: "Portfolio personnalisable avec admin Next.js et deploiement Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${headingFont.variable} ${bodyFont.variable}`}
      data-theme="light"
      lang="fr"
    >
      <body>{children}</body>
    </html>
  );
}
