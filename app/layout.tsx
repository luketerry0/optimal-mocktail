import type { Metadata } from 'next'
import { Nixie_One, Ledger, Caveat } from 'next/font/google'
import { Analytics } from './Analytics'
import { SiteHeader } from './SiteHeader'
import './globals.css'

const nixie = Nixie_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-nixie',
  display: 'swap',
})

const ledger = Ledger({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-ledger',
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
      className={`${nixie.variable} ${ledger.variable} ${caveat.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <SiteHeader />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-12">
          {children}
        </main>

        <footer className="mt-16 bg-navy text-white">
          <div className="mx-auto max-w-5xl px-4 py-10 text-center">
            <p className="font-display text-lg font-bold">
              Optimal<span className="text-accent">Mocktail</span>
            </p>
            <p className="mt-2 text-sm text-white/70">
              &copy; 2026 Optimal Mocktail. All rights reserved.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
