import Link from 'next/link'
import Image from 'next/image'
import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity.client'
import { isPreviewEnabled } from '@/lib/draft-mode'
import { urlForImage } from '@/lib/sanity.image'
import { notFound } from 'next/navigation'
import { CommentForm } from './CommentForm'

export const dynamic = 'force-dynamic'

interface Footnote {
  _key: string
  _type: 'footnote'
  text?: PortableTextBlock[]
}

/**
 * Walk the article body in document order and return every inline footnote,
 * so each one can be assigned a stable sequential number.
 */
function collectFootnotes(body?: PortableTextBlock[]): Footnote[] {
  const notes: Footnote[] = []
  for (const block of body || []) {
    const children = (block as { children?: { _type?: string }[] }).children
    if (block._type === 'block' && Array.isArray(children)) {
      for (const child of children) {
        if (child._type === 'footnote') {
          notes.push(child as unknown as Footnote)
        }
      }
    }
  }
  return notes
}

const footnoteTextComponents: PortableTextComponents = {
  marks: {
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

function makePortableTextComponents(
  footnoteNumbers: Map<string, number>
): PortableTextComponents {
  return {
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
      footnote: ({ value }) => {
        const n = footnoteNumbers.get(value?._key)
        if (!n) return null
        return (
          <sup id={`fnref-${n}`} className="text-xs font-semibold">
            <a
              href={`#fn-${n}`}
              aria-label={`Jump to footnote ${n}`}
              className="text-accent no-underline transition hover:text-accent-dark"
            >
              [{n}]
            </a>
          </sup>
        )
      },
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
  glassware?: string
  garnish?: string
  ingredients?: string[]
  instructions?: string[]
  relatedPosts?: RelatedPost[]
}

function RecipeCard({ recipe }: { recipe?: Recipe }) {
  if (!recipe?.name) return null

  const { name, description, servings, glassware, garnish } = recipe
  const ingredients = recipe.ingredients || []
  const instructions = recipe.instructions || []
  const relatedPosts = recipe.relatedPosts || []

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name,
  }
  if (description) jsonLd.description = description
  if (servings) jsonLd.recipeYield = servings
  if (ingredients.length) jsonLd.recipeIngredient = ingredients
  if (instructions.length) {
    jsonLd.recipeInstructions = instructions.map((text) => ({
      '@type': 'HowToStep',
      text,
    }))
  }

  return (
    <div className="menu-card my-10 rounded-sm px-6 py-8 sm:px-10 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative z-10">
        <div className="text-center">
          <span className="menu-label text-xs text-gold">Cocktail Recipe</span>
          <h3 className="mt-2 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">
            {name}
          </h3>
          {description && (
            <p className="mx-auto mt-2 max-w-xl text-lg italic text-navy-700">{description}</p>
          )}
          <div className="menu-divider mx-auto mt-5 max-w-xs">
            <span className="text-base">❖</span>
          </div>
        </div>

        {(servings || glassware || garnish) && (
          <dl className="mx-auto mt-5 flex max-w-lg flex-col items-center gap-3 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10">
            {servings ? (
              <div className="flex flex-col items-center">
                <dt className="menu-label text-[0.6rem] text-gold">Yield</dt>
                <dd className="font-display text-lg text-navy">{servings}</dd>
              </div>
            ) : null}
            {glassware ? (
              <div className="flex flex-col items-center">
                <dt className="menu-label text-[0.6rem] text-gold">Glassware</dt>
                <dd className="font-display text-lg text-navy">{glassware}</dd>
              </div>
            ) : null}
            {garnish ? (
              <div className="flex flex-col items-center">
                <dt className="menu-label text-[0.6rem] text-gold">Garnish</dt>
                <dd className="font-display text-lg text-navy">{garnish}</dd>
              </div>
            ) : null}
          </dl>
        )}

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {ingredients.length > 0 && (
            <div>
              <h4 className="menu-label mb-3 text-sm text-gold">Ingredients</h4>
              <ul className="space-y-2 text-lg text-navy-900 marker:text-accent">
                {ingredients.map((item, i) => (
                  <li key={i} className="border-b border-dotted border-gold/40 pb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {instructions.length > 0 && (
            <div>
              <h4 className="menu-label mb-3 text-sm text-gold">Method</h4>
              <ol className="space-y-3 text-lg text-navy-900">
                {instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-display text-lg font-bold text-accent">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-8 border-t border-dotted border-gold/50 pt-5 text-center">
            <h4 className="menu-label mb-3 text-sm text-gold">Pairs Well With</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {relatedPosts
                .filter((p) => p?.slug)
                .map((p) => (
                  <Link
                    key={p._id}
                    href={`/posts/${p.slug}`}
                    className="rounded-full border border-gold/50 bg-white px-4 py-1.5 font-display text-sm font-medium text-navy shadow-sm transition hover:bg-accent hover:text-white"
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
  image?: any
  body?: any[]
  publishedAt: string
  author?: string
  featured?: boolean
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
        author,
        featured
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

  const footnotes = collectFootnotes(post.body)
  const footnoteNumbers = new Map<string, number>()
  footnotes.forEach((note, i) => footnoteNumbers.set(note._key, i + 1))
  const portableTextComponents = makePortableTextComponents(footnoteNumbers)

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

      {post.featured && (
        <span className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          ★ Featured
        </span>
      )}

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

      {post.body && (
        <div className="prose prose-lg max-w-none text-lg leading-relaxed prose-headings:font-display prose-headings:text-navy prose-p:text-navy-900 prose-li:text-navy-900 prose-a:text-accent prose-strong:text-navy sm:text-xl mb-8">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
      )}

      {footnotes.length > 0 && (
        <section className="mt-12 border-t border-navy-100 pt-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy-700">
            Footnotes
          </h2>
          <ol className="space-y-2 text-sm text-navy-700">
            {footnotes.map((note, i) => (
              <li key={note._key} id={`fn-${i + 1}`} className="flex gap-2">
                <span className="font-semibold text-accent">{i + 1}.</span>
                <span className="[&_a]:text-accent [&_a]:underline">
                  {note.text ? (
                    <PortableText value={note.text} components={footnoteTextComponents} />
                  ) : null}{' '}
                  <a
                    href={`#fnref-${i + 1}`}
                    aria-label={`Back to reference ${i + 1}`}
                    className="text-accent no-underline transition hover:text-accent-dark"
                  >
                    ↩
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </section>
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
