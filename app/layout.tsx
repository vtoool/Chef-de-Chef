import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant } from 'next/font/google'
import './globals.css'

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
  description: "Website for the Moldovan folk dance ensemble 'Ansamblul Chef de Chef', featuring services, gallery, testimonials, and a booking system.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className={`${inter.variable} ${playfairDisplay.variable} ${cormorant.variable}`}>
      <head>
        <link rel="stylesheet" href="https://aistudiocdn.com/react-day-picker@^8.10.1/dist/style.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
