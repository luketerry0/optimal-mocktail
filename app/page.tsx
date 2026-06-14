import Link from 'next/link'
import { draftMode } from 'next/headers'
import { sanityClient } from '@/lib/sanity.client'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  author?: string
}

async function getPosts(): Promise<Post[]> {
  try {
    // Check if Sanity is configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here') {
      return []
    }
    
    const draft = await draftMode()
    const preview = draft.isEnabled

    const posts = await sanityClient(preview).fetch(
      `*[_type == "post" ${!preview ? '&& defined(publishedAt)' : ''}] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        author
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
  const draft = await draftMode()

  return (
    <div>
      {draft.isEnabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
          <p className="text-yellow-800 text-sm">
            📝 <strong>Draft Mode Enabled</strong> — You&apos;re viewing unpublished content
          </p>
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Welcome to Optimal Mocktail</h2>
        <p className="text-gray-700 mb-6">
          Explore our collection of refreshing mocktail recipes. Perfect for any occasion, these
          alcohol-free drinks are sure to impress your guests.
        </p>
        <Link
          href="/posts"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Browse Recipes
        </Link>
      </section>

      {posts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(0, 3).map((post) => (
              <article
                key={post._id}
                className="border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  {post.author && <span>{post.author}</span>}
                </div>
                <Link
                  href={`/posts/${post.slug.current}`}
                  className="text-blue-600 hover:underline mt-4 inline-block"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
