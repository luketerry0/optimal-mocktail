import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity.client'

export const metadata: Metadata = {
  title: 'About — Optimal Mocktail',
  description: 'Learn more about Optimal Mocktail and our love of alcohol-free drinks.',
}

// Re-fetch the About content from the Sanity CDN at most once per minute so
// edits appear without a redeploy.
export const revalidate = 60

interface About {
  heading?: string
  subheading?: string
  body?: PortableTextBlock[]
  ctaHeading?: string
  ctaText?: string
  ctaButtonLabel?: string
}

const fallback = {
  heading: 'About Us',
  subheading: 'Crafting refreshing, alcohol-free drinks that everyone can enjoy.',
  ctaHeading: 'Ready to mix something up?',
  ctaText: 'Browse our latest mocktail recipes.',
  ctaButtonLabel: 'Browse Recipes',
  paragraphs: [
    'Optimal Mocktail began with a simple idea: a great drink doesn’t need alcohol to be memorable. We share vibrant, easy-to-make mocktail recipes built around fresh ingredients and bold flavors.',
    'Whether you’re hosting a party, winding down after a long day, or looking for something special to sip, our recipes are designed to be approachable, delicious, and endlessly customizable.',
    'Every recipe is tested in our own kitchen and written to be easy to follow — with clear ingredients, simple steps, and a few tips along the way. We hope they bring a little extra joy to your glass.',
  ],
}

async function getAbout(): Promise<About | null> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here'
    ) {
      return null
    }
    return await sanityClient(false).fetch(
      `*[_type == "about"][0] {
        heading,
        subheading,
        body,
        ctaHeading,
        ctaText,
        ctaButtonLabel
      }`,
    )
  } catch (error) {
    console.error('Error fetching about page:', error)
    return null
  }
}

export default async function AboutPage() {
  const about = await getAbout()

  const heading = about?.heading || fallback.heading
  const subheading = about?.subheading || fallback.subheading
  const ctaHeading = about?.ctaHeading || fallback.ctaHeading
  const ctaText = about?.ctaText || fallback.ctaText
  const ctaButtonLabel = about?.ctaButtonLabel || fallback.ctaButtonLabel
  const hasBody = Array.isArray(about?.body) && about.body.length > 0

  return (
    <div className="mx-auto max-w-3xl">
      <section className="mb-12 rounded-3xl bg-cream px-6 py-12 text-center sm:px-10 sm:py-16">
        <h1 className="text-3xl font-bold text-navy sm:text-5xl">{heading}</h1>
        {subheading && (
          <p className="mx-auto mt-4 max-w-xl text-base text-navy-700 sm:text-lg">
            {subheading}
          </p>
        )}
      </section>

      <div className="space-y-6 text-lg leading-relaxed text-navy-700 [&_a]:font-medium [&_a]:text-accent [&_a]:underline">
        {hasBody ? (
          <PortableText value={about!.body!} />
        ) : (
          fallback.paragraphs.map((p, i) => <p key={i}>{p}</p>)
        )}
      </div>

      <div className="mt-12 rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-navy">{ctaHeading}</h2>
        {ctaText && <p className="mt-2 text-navy-700">{ctaText}</p>}
        <Link
          href="/posts"
          className="mt-6 inline-block rounded-full bg-accent px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-dark"
        >
          {ctaButtonLabel}
        </Link>
      </div>
    </div>
  )
}
