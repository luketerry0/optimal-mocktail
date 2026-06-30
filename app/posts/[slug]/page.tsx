import Link from 'next/link'
import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity.client'
import { isPreviewEnabled } from '@/lib/draft-mode'
import { urlForImage } from '@/lib/sanity.image'
import { notFound } from 'next/navigation'
import { CommentForm } from './CommentForm'

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <span className="relative block w-full aspect-[16/9] my-6 overflow-hidden rounded-lg">
          <Image
            src={urlForImage(value).width(1200).fit('max').url()}
            alt={value.alt || ''}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </span>
      )
    },
    youtube: ({ value }) => {
      const id = getYouTubeId(value?.url)
      if (!id) return null
      return (
        <span className="relative block w-full aspect-video my-6 overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </span>
      )
    },
    recipe: ({ value }) => <RecipeCard recipe={value} />,
  },
  marks: {
    internalLink: ({ value, children }) => {
      const slug = value?.slug
      if (!slug) return <>{children}</>
      return (
        <Link
          href={`/posts/${slug}`}
          className="font-medium text-accent underline underline-offset-2 transition hover:text-accent-dark"
        >
          {children}
        </Link>
      )
    },
    link: ({ value, children }) => {
      const href = value?.href
      if (!href) return <>{children}</>
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="font-medium text-accent underline underline-offset-2 transition hover:text-accent-dark"
        >
          {children}
        </a>
      )
    },
  },
}

interface RelatedPost {
  _id: string
  title?: string
  slug?: string
}

interface Recipe {
  name?: string
  description?: string
  servings?: string
  prepMinutes?: number
  cookMinutes?: number
  ingredients?: string[]
  instructions?: string[]
  relatedPosts?: RelatedPost[]
}

function minutesToISO(minutes?: number): string | undefined {
  if (!minutes || minutes <= 0) return undefined
  return `PT${minutes}M`
}

function RecipeCard({ recipe }: { recipe?: Recipe }) {
  if (!recipe?.name) return null

  const { name, description, servings, prepMinutes, cookMinutes } = recipe
  const ingredients = recipe.ingredients || []
  const instructions = recipe.instructions || []
  const relatedPosts = recipe.relatedPosts || []
  const totalMinutes = (prepMinutes || 0) + (cookMinutes || 0)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name,
  }
  if (description) jsonLd.description = description
  if (servings) jsonLd.recipeYield = servings
  if (minutesToISO(prepMinutes)) jsonLd.prepTime = minutesToISO(prepMinutes)
  if (minutesToISO(cookMinutes)) jsonLd.cookTime = minutesToISO(cookMinutes)
  if (minutesToISO(totalMinutes)) jsonLd.totalTime = minutesToISO(totalMinutes)
  if (ingredients.length) jsonLd.recipeIngredient = ingredients
  if (instructions.length) {
    jsonLd.recipeInstructions = instructions.map((text) => ({
      '@type': 'HowToStep',
      text,
    }))
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-accent/20 bg-cream shadow-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-accent px-6 py-4 text-white">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
          Recipe
        </span>
        <h3 className="text-2xl font-bold leading-tight">{name}</h3>
      </div>
      <div className="p-6">
        {description && <p className="mb-4 text-navy-700">{description}</p>}

        <div className="mb-6 flex flex-wrap gap-2">
          {prepMinutes ? (
            <span className="rounded-full bg-white px-3 py-1 text-sm text-navy shadow-sm">
              <strong>Prep</strong> {prepMinutes} min
            </span>
          ) : null}
          {cookMinutes ? (
            <span className="rounded-full bg-white px-3 py-1 text-sm text-navy shadow-sm">
              <strong>Cook</strong> {cookMinutes} min
            </span>
          ) : null}
          {totalMinutes ? (
            <span className="rounded-full bg-white px-3 py-1 text-sm text-navy shadow-sm">
              <strong>Total</strong> {totalMinutes} min
            </span>
          ) : null}
          {servings ? (
            <span className="rounded-full bg-white px-3 py-1 text-sm text-navy shadow-sm">
              <strong>Yield</strong> {servings}
            </span>
          ) : null}
        </div>

      {ingredients.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-2 font-byline text-3xl leading-none text-accent">Ingredients</h4>
          <ul className="list-inside list-disc space-y-1 text-navy-700 marker:text-accent">
            {ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {instructions.length > 0 && (
        <div>
          <h4 className="mb-2 font-byline text-3xl leading-none text-accent">Instructions</h4>
          <ol className="list-inside list-decimal space-y-2 text-navy-700 marker:font-bold marker:text-accent">
            {instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="mt-6 border-t border-accent/20 pt-4">
          <h4 className="mb-2 font-byline text-3xl leading-none text-accent">Related recipes</h4>
          <div className="flex flex-wrap gap-2">
            {relatedPosts
              .filter((p) => p?.slug)
              .map((p) => (
                <Link
                  key={p._id}
                  href={`/posts/${p.slug}`}
                  className="rounded-full bg-white px-3 py-1 text-sm font-medium text-accent shadow-sm transition hover:bg-accent hover:text-white"
                >
                  {p.title || 'View recipe'}
                </Link>
              ))}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

function getYouTubeId(url?: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

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
  image?: any
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
        image,
        body[]{
          ...,
          markDefs[]{
            ...,
            _type == "internalLink" => {
              "slug": @.reference->slug.current
            }
          },
          _type == "recipe" => {
            ...,
            relatedPosts[]->{
              _id,
              title,
              "slug": slug.current
            }
          }
        },
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

interface Comment {
  _id: string
  name: string
  message: string
  createdAt: string
}

async function getComments(postId: string): Promise<Comment[]> {
  try {
    return await sanityClient(false).fetch(
      `*[_type == "comment" && approved == true && post._ref == $postId] | order(createdAt desc) {
        _id,
        name,
        message,
        createdAt
      }`,
      { postId }
    )
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug, await isPreviewEnabled())

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
  const preview = await isPreviewEnabled()
  const post = await getPost(slug, preview)

  if (!post) {
    notFound()
  }

  const comments = await getComments(post._id)

  return (
    <article className="mx-auto max-w-3xl">
      {preview && (
        <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            📝 <strong>Preview Mode</strong> — You&apos;re viewing unpublished content
          </p>
        </div>
      )}

      <Link
        href="/posts"
        className="mb-6 inline-block text-sm font-medium text-accent transition hover:text-accent-dark"
      >
        ← Back to Recipes
      </Link>

      <h1 className="mb-4 text-3xl font-bold leading-tight text-navy sm:text-4xl">
        {post.title}
      </h1>

      {post.image && (
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={urlForImage(post.image).width(1200).height(675).fit('crop').url()}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mb-8 flex items-center justify-between border-b border-navy-100 pb-4 text-sm text-navy-700">
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        {post.author && (
          <span className="font-byline text-3xl leading-none text-accent">
            by {post.author}
          </span>
        )}
      </div>

      {post.excerpt && (
        <p className="mb-8 border-l-4 border-accent pl-4 text-lg italic text-navy-700 sm:text-xl">
          {post.excerpt}
        </p>
      )}

      {post.body && (
        <div className="prose max-w-none prose-headings:font-display prose-headings:text-navy prose-a:text-accent prose-strong:text-navy mb-8">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
      )}

      <section className="mt-12 border-t border-navy-100 pt-8">
        <h2 className="mb-6 text-2xl font-bold text-navy">
          Comments{comments.length > 0 ? ` (${comments.length})` : ''}
        </h2>

        {comments.length > 0 ? (
          <ul className="mb-10 space-y-4">
            {comments.map((comment) => (
              <li
                key={comment._id}
                className="rounded-xl border border-navy-100 bg-cream p-4"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-navy">{comment.name}</span>
                  <span className="text-xs text-navy-700">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="whitespace-pre-line text-navy-700">{comment.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-10 text-navy-700">Be the first to comment.</p>
        )}

        <h3 className="mb-4 text-xl font-bold text-navy">Leave a comment</h3>
        <CommentForm postId={post._id} />
      </section>
    </article>
  )
}
