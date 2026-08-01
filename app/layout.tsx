import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Caveat, Yellowtail } from 'next/font/google'
import { Analytics } from './Analytics'
import { SiteHeader } from './SiteHeader'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const yellowtail = Yellowtail({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jersey',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Optimal Mocktail',
  description: 'Discover delicious mocktail recipes and tips',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${caveat.variable} ${yellowtail.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <SiteHeader />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-12">
          {children}
        </main>

        <footer className="mt-16 bg-navy-900 text-white">
          <div className="mx-auto max-w-5xl px-4 py-10 text-center">
            <p className="font-jersey text-3xl">
              Optimal<span className="text-accent-light">Mocktail</span>
            </p>
            <p className="mt-1 font-byline text-2xl text-accent-light">
            Shaken , not slurred.
            </p>
            <p className="mt-3 text-sm text-white/70">
              &copy; 2026 Optimal Mocktail. All rights reserved.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
