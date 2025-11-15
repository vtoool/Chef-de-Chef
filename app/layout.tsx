import React from 'react';
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'Ansamblul Chef de Chef | Dansuri Populare Moldovenești',
  description: "Site-ul web al ansamblului de dansuri populare moldovenești 'Ansamblul Chef de Chef', care prezintă servicii, galerie, testimoniale și un sistem de rezervări.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className={`${inter.variable} ${playfairDisplay.variable} ${cormorant.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB" type="image/jpeg" sizes="any" />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}