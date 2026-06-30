import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Optimal Mocktail',
  description: 'Learn more about Optimal Mocktail and our love of alcohol-free drinks.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <section className="mb-12 rounded-3xl bg-cream px-6 py-12 text-center sm:px-10 sm:py-16">
        <h1 className="text-3xl font-bold text-navy sm:text-5xl">About Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-navy-700 sm:text-lg">
          Crafting refreshing, alcohol-free drinks that everyone can enjoy.
        </p>
      </section>

      <div className="space-y-6 text-lg leading-relaxed text-navy-700">
        <p>
          Optimal Mocktail began with a simple idea: a great drink doesn&apos;t
          need alcohol to be memorable. We share vibrant, easy-to-make mocktail
          recipes built around fresh ingredients and bold flavors.
        </p>
        <p>
          Whether you&apos;re hosting a party, winding down after a long day, or
          looking for something special to sip, our recipes are designed to be
          approachable, delicious, and endlessly customizable.
        </p>
        <p>
          Every recipe is tested in our own kitchen and written to be easy to
          follow — with clear ingredients, simple steps, and a few tips along the
          way. We hope they bring a little extra joy to your glass.
        </p>
      </div>

      <div className="mt-12 rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-navy">Ready to mix something up?</h2>
        <p className="mt-2 text-navy-700">Browse our latest mocktail recipes.</p>
        <Link
          href="/posts"
          className="mt-6 inline-block rounded-full bg-accent px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-dark"
        >
          Browse Recipes
        </Link>
      </div>
    </div>
  )
}
