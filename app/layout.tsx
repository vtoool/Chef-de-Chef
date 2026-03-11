import React from 'react';
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant, Yesteryear } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
  weight: ['700', '900']
})

const cormorant = Cormorant({ 
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '700']
})

const yesteryear = Yesteryear({
  subsets: ['latin'],
  variable: '--font-yesteryear',
  display: 'swap',
  weight: '400',
});

const heroImageUrl = '/images/hero.webp';
const siteTitle = 'Ansamblul Chef de Chef | Dansuri Populare Moldovenești';
const siteDescription = "Site-ul web al ansamblului de dansuri populare moldovenești 'Ansamblul Chef de Chef', care prezintă servicii, galerie, testimoniale și un sistem de rezervări.";
const ogDescription = 'Tradiție și eleganță pentru un eveniment memorabil.';


export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: ogDescription,
    images: [
      {
        url: heroImageUrl,
        width: 1200,
        height: 630,
        alt: 'Ansamblul Chef de Chef în timpul unui spectacol',
      },
    ],
    locale: 'ro_RO',
    type: 'website',
    siteName: 'Ansamblul Chef de Chef',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: ogDescription,
    images: [heroImageUrl],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className={`${inter.variable} ${playfairDisplay.variable} ${cormorant.variable} ${yesteryear.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/images/favicon.webp" type="image/webp" sizes="any" />
      </head>
      <body className="bg-brand-cream text-brand-brown-dark font-sans">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}