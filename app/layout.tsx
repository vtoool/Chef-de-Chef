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

const heroImageUrl = 'https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/480324791_953081760294442_1783990944146547779_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=E9Ugi3ich00Q7kNvwG24Ir0&_nc_oc=AdnVKu1X1lh40_nRoItDbZmqnVajD1kJR6notxKzQBanHFld1n4oMHTJrTVLl8hXxbW_fAfxHYVLIlxQPi6rXA8t&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=f47qOphwVxSDs_JdfrLd4A&oh=00_AfiznpsExseIWO4p392EUF_9LuwaL6wabziHToNGqkIWrw&oe=691DD445';
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
        <link rel="icon" href="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB" type="image/jpeg" sizes="any" />
      </head>
      <body className="bg-brand-cream text-brand-brown-dark font-sans">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}