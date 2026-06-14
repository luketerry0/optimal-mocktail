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

export default async function PostsPage() {
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

      <h1 className="text-3xl font-bold mb-8">All Recipes</h1>

      {posts.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-blue-800 mb-2">No recipes found yet.</p>
          <p className="text-sm text-blue-700">
            Configure your Sanity project ID in <code className="bg-blue-100 px-1">.env.local</code> to see published recipes.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post._id} className="border-b pb-6">
              <Link href={`/posts/${post.slug.current}`}>
                <h2 className="text-2xl font-bold hover:text-blue-600 cursor-pointer">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && <p className="text-gray-600 my-2">{post.excerpt}</p>}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                {post.author && <span>by {post.author}</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
