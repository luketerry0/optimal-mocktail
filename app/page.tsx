import Link from 'next/link'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity.client'
import { isPreviewEnabled } from '@/lib/draft-mode'
import { urlForImage } from '@/lib/sanity.image'

export const dynamic = 'force-dynamic'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  image?: any
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
    
    const preview = await isPreviewEnabled()

    const posts = await sanityClient(preview).fetch(
      `*[_type == "post" ${!preview ? '&& defined(publishedAt)' : ''}] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        image,
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

      <section className="mb-14 rounded-3xl bg-cream px-6 py-12 text-center sm:px-10 sm:py-20">
        <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
          Alcohol-free &amp; delicious
        </span>
        <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-navy sm:text-5xl">
          Refreshing mocktails for every occasion
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-navy-700 sm:text-lg">
          Explore our collection of vibrant, alcohol-free recipes — perfect for
          parties, dinners, or a quiet night in.
        </p>
        <Link
          href="/posts"
          className="mt-8 inline-block rounded-full bg-accent px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-dark"
        >
          Browse Recipes
        </Link>
      </section>

      {posts.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-bold text-navy sm:text-3xl">
            Featured Recipes
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post._id}
                href={`/posts/${post.slug.current}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {post.image ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={urlForImage(post.image).width(600).height(375).fit('crop').url()}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full bg-cream" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-navy transition group-hover:text-accent">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-navy-700">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-3 text-xs text-navy-700">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    {post.author && (
                      <span className="font-byline text-xl leading-none text-accent">
                        by {post.author}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
