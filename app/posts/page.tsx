import { sanityClient } from '@/lib/sanity.client'
import { isPreviewEnabled } from '@/lib/draft-mode'
import { MenuList } from '../components/MenuList'

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

async function getPosts(type: 'mocktails' | 'substitutes' | 'all'): Promise<Post[]> {
  try {
    // Check if Sanity is configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here') {
      return []
    }
    
    const preview = await isPreviewEnabled()

    let typeFilter = ''
    if (type === 'substitutes') {
      typeFilter = '&& alcoholSubstitute == true'
    } else if (type === 'mocktails') {
      typeFilter = '&& alcoholSubstitute != true'
    }

    const posts = await sanityClient(preview).fetch(
      `*[_type == "post" ${!preview ? '&& defined(publishedAt)' : ''} && resource != true ${typeFilter}] | order(featured desc, publishedAt desc) {
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

const HEADINGS = {
  all: { label: 'The Recipe Menu', kicker: 'Optimal Mocktail' },
  mocktails: { label: 'Mocktails', kicker: 'The Recipe Menu' },
  substitutes: { label: 'Alcohol Substitutes', kicker: 'The Recipe Menu' },
} as const

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type: typeParam } = await searchParams
  const type =
    typeParam === 'substitutes'
      ? 'substitutes'
      : typeParam === 'mocktails'
        ? 'mocktails'
        : 'all'
  const posts = await getPosts(type)
  const preview = await isPreviewEnabled()
  const heading = HEADINGS[type]

  return (
    <div>
      {preview && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
          <p className="text-yellow-800 text-sm">
            📝 <strong>Preview Mode</strong> — You&apos;re viewing unpublished content
          </p>
        </div>
      )}

      <header className="mb-10 text-center">
        <p className="menu-label text-sm text-gold">{heading.kicker}</p>
        <h1 className="mt-2 text-4xl font-bold text-navy sm:text-5xl">{heading.label}</h1>
        <div className="menu-divider mx-auto mt-4 max-w-sm">
          <span className="text-lg">❖</span>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="menu-card rounded-sm p-8 text-center">
          <p className="relative z-10 font-display text-xl text-navy">
            The menu is being prepared.
          </p>
          <p className="relative z-10 mt-1 text-navy-700">
            Configure your Sanity project ID in{' '}
            <code className="rounded bg-cream px-1">.env.local</code> to see published recipes.
          </p>
        </div>
      ) : (
        <MenuList items={posts} />
      )}
    </div>
  )
}
