import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white py-6">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold">
              <a href="/">Optimal Mocktail</a>
            </h1>
            <p className="text-blue-100">Delicious mocktail recipes</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-100 py-6 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2024 Optimal Mocktail. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
