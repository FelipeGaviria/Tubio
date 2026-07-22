import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";

import { site } from "@/content/site";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ['diseño web', 'landing pages', 'páginas web', 'Next.js', 'Vercel', 'Colombia', 'TuBio'],
  authors: [{ name: 'TuBio' }],
  creator: 'TuBio',
  publisher: 'TuBio',
  category: 'technology',
  robots: { index: true, follow: true },
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  keywords: ['diseño web', 'landing pages', 'páginas web', 'Next.js', 'Vercel', 'Colombia', 'TuBio'],
  authors: [{ name: 'TuBio' }],
  creator: 'TuBio',
  publisher: 'TuBio',
  category: 'technology',
  robots: { index: true, follow: true },
    type: "website",
    locale: "es_CO",
    siteName: site.name,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  keywords: ['diseño web', 'landing pages', 'páginas web', 'Next.js', 'Vercel', 'Colombia', 'TuBio'],
  authors: [{ name: 'TuBio' }],
  creator: 'TuBio',
  publisher: 'TuBio',
  category: 'technology',
  robots: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body>{children}</body>
    </html>
  );
}