import Link from 'next/link'
import { draftMode } from 'next/headers'
import { PortableText } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity.client'
import { notFound } from 'next/navigation'

interface PostPageProps {
  params: {
    slug: string
  }
}

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  body?: any[]
  publishedAt: string
  author?: string
}

async function getPost(slug: string, preview: boolean): Promise<Post | null> {
  try {
    // Check if Sanity is configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here') {
      return null
    }
    
    const post = await sanityClient(preview).fetch(
      `*[_type == "post" && slug.current == $slug ${!preview ? '&& defined(publishedAt)' : ''}][0] {
        _id,
        title,
        slug,
        excerpt,
        body,
        publishedAt,
        author
      }`,
      { slug }
    )
    return post || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const draft = await draftMode()
  const post = await getPost(slug, draft.isEnabled)

  if (!post) {
    return { title: 'Post not found' }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const draft = await draftMode()
  const post = await getPost(slug, draft.isEnabled)

  if (!post) {
    notFound()
  }

  return (
    <article>
      {draft.isEnabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
          <p className="text-yellow-800 text-sm">
            📝 <strong>Draft Mode Enabled</strong> — You&apos;re viewing unpublished content
          </p>
        </div>
      )}

      <Link href="/posts" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Recipes
      </Link>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex justify-between items-center text-gray-600 mb-8 border-b pb-4">
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        {post.author && <span>by {post.author}</span>}
      </div>

      {post.excerpt && (
        <p className="text-xl text-gray-700 mb-8 italic">{post.excerpt}</p>
      )}

      {post.body && (
        <div className="prose prose-sm max-w-none mb-8">
          <PortableText value={post.body} />
        </div>
      )}
    </article>
  )
}
