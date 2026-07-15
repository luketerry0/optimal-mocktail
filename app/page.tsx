import Link from 'next/link'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity.client'
import { isPreviewEnabled } from '@/lib/draft-mode'
import { MenuList } from './components/MenuList'

export const dynamic = 'force-dynamic'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  image?: any
  publishedAt: string
  author?: string
  featured?: boolean
}

async function getPosts(): Promise<Post[]> {
  try {
    // Check if Sanity is configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here') {
      return []
    }
    
    const preview = await isPreviewEnabled()

    const posts = await sanityClient(preview).fetch(
      `*[_type == "post" ${!preview ? '&& defined(publishedAt)' : ''}] | order(publishedAt desc) {
        _id,
        title,
        slug,
        image,
        publishedAt,
        author,
        featured
      }`
    )
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()
  const preview = await isPreviewEnabled()

  return (
    <div>
      {preview && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
          <p className="text-yellow-800 text-sm">
            📝 <strong>Preview Mode</strong> — You&apos;re viewing unpublished content
          </p>
        </div>
      )}

      <section className="brand-hero neon-frame mb-14 overflow-hidden rounded-3xl px-6 py-7 sm:px-12 sm:py-10">
        <div className="hero-bubbles" aria-hidden="true">
          <span style={{ left: '8%', width: 10, height: 10, animationDuration: '7s', animationDelay: '0s' }} />
          <span style={{ left: '20%', width: 6, height: 6, animationDuration: '5.5s', animationDelay: '1.2s' }} />
          <span style={{ left: '33%', width: 14, height: 14, animationDuration: '9s', animationDelay: '0.6s' }} />
          <span style={{ left: '47%', width: 8, height: 8, animationDuration: '6.5s', animationDelay: '2.1s' }} />
          <span style={{ left: '61%', width: 5, height: 5, animationDuration: '5s', animationDelay: '0.3s' }} />
          <span style={{ left: '74%', width: 12, height: 12, animationDuration: '8.5s', animationDelay: '1.7s' }} />
          <span style={{ left: '88%', width: 7, height: 7, animationDuration: '6s', animationDelay: '2.6s' }} />
        </div>

        <div className="relative z-10 grid items-center gap-6 sm:grid-cols-[1.4fr_1fr]">
          <div className="text-center sm:text-left">
            <span className="menu-label mb-2 inline-block text-xs text-gold-light sm:text-sm">
              Est. 2026 · Alcohol-Free
            </span>
            <p className="font-jersey text-4xl leading-tight text-white sm:text-6xl">
              Optimal Mocktail
            </p>
            <p className="mx-auto mt-2 max-w-xl text-base text-cream/90 sm:mx-0 sm:text-lg">
              A curated menu of vibrant, alcohol-free cocktails — crafted for
              parties, dinners, or a quiet night in.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              <Link
                href="/posts"
                className="inline-block rounded-full border border-gold/70 bg-accent px-6 py-2.5 font-display font-semibold tracking-wide text-white shadow-lg shadow-navy-900/30 transition hover:-translate-y-0.5 hover:bg-accent-dark"
              >
                View the Menu
              </Link>
              <span className="font-byline text-2xl text-gold-light">

              </span>
            </div>
          </div>
          <div className="relative mx-auto hidden aspect-square w-32 sm:block">
            <Image
              src="/logo.png"
              alt="Optimal Mocktail"
              fill
              priority
              sizes="128px"
              className="rounded-full object-cover shadow-2xl ring-4 ring-gold/40"
            />
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section>
          <div className="menu-divider mx-auto mb-8 max-w-md">
            <span className="menu-label text-sm text-gold">Latest Pours</span>
          </div>
          <MenuList items={posts.slice(0, 5)} />
        </section>
      )}
    </div>
  )
}
