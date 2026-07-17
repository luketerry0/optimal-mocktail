import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity.client'

export const metadata: Metadata = {
  title: 'About — Optimal Mocktail',
  description: 'Learn more about Optimal Mocktail and our love of alcohol-free drinks.',
}

// Always render fresh so About edits appear immediately.
export const dynamic = 'force-dynamic'

interface About {
  heading?: string
  subheading?: string
  body?: PortableTextBlock[]
  ctaHeading?: string
  ctaText?: string
  ctaButtonLabel?: string
}

const fallback = {
  heading: '',
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
  const subheading = about?.subheading
  const ctaHeading = about?.ctaHeading
  const ctaText = about?.ctaText
  const ctaButtonLabel = about?.ctaButtonLabel
  const hasBody = Array.isArray(about?.body) && about.body.length > 0

  return (
    <div className="mx-auto max-w-3xl">
      <section className="brand-hero mb-12 rounded-3xl px-6 py-14 text-center sm:px-10 sm:py-16">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">{heading}</h1>
          {subheading && (
            <p className="mx-auto mt-4 max-w-xl text-base text-cream/90 sm:text-lg">
              {subheading}
            </p>
          )}
        </div>
      </section>

      {hasBody && (
        <div className="space-y-6 text-lg leading-relaxed text-navy-700 [&_a]:font-medium [&_a]:text-accent [&_a]:underline">
          <PortableText value={about!.body!} />
        </div>
      )}

      {(ctaHeading || ctaText || ctaButtonLabel) && (
        <div className="menu-card mt-12 rounded-sm p-8 text-center sm:p-10">
          <div className="relative z-10">
            {ctaHeading && (
              <h2 className="font-display text-3xl font-bold text-navy">{ctaHeading}</h2>
            )}
            {ctaText && <p className="mt-2 text-lg italic text-navy-700">{ctaText}</p>}
            {ctaButtonLabel && (
              <Link
                href="/posts"
                className="mt-6 inline-block rounded-full border border-gold/70 bg-accent px-8 py-3 font-display font-semibold tracking-wide text-white shadow-lg shadow-navy-900/20 transition hover:-translate-y-0.5 hover:bg-accent-dark"
              >
                {ctaButtonLabel}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
