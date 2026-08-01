'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page render error:', error)
  }, [error])

  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <div className="menu-card rounded-sm p-8 sm:p-10">
        <div className="relative z-10">
          <p className="menu-label text-sm text-gold">Last Call</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
            Something went wrong pouring this page
          </h1>
          <p className="mx-auto mt-3 max-w-md text-navy-700">
            We hit an unexpected error while loading this content. Please try
            again — if it keeps happening, the page may reference a recipe that
            is still being prepared.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-block rounded-full border border-gold/70 bg-accent px-6 py-2.5 font-display font-semibold tracking-wide text-white shadow-lg shadow-navy-900/30 transition hover:-translate-y-0.5 hover:bg-accent-dark"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-block font-medium text-accent underline underline-offset-2 transition hover:text-accent-dark"
            >
              Back to the bar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
