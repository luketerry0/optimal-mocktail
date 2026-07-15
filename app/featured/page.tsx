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

async function getFeaturedPosts(): Promise<Post[]> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here'
    ) {
      return []
    }

    const preview = await isPreviewEnabled()

    const posts = await sanityClient(preview).fetch(
      `*[_type == "post" && featured == true ${!preview ? '&& defined(publishedAt)' : ''}] | order(publishedAt desc) {
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
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export default async function FeaturedPage() {
  const posts = await getFeaturedPosts()
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

      <header className="mb-10 text-center">
        <p className="menu-label text-sm text-gold">Barkeep&apos;s Selection</p>
        <h1 className="mt-2 text-4xl font-bold text-navy sm:text-5xl">Signature Cocktails</h1>
        <div className="menu-divider mx-auto mt-4 max-w-sm">
          <span className="text-lg">❖</span>
        </div>
      </header>

      {posts.length > 0 && <MenuList items={posts} />}
    </div>
  )
}
