import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity.client'
import { isPreviewEnabled } from '@/lib/draft-mode'
import { urlForImage } from '@/lib/sanity.image'

export const metadata: Metadata = {
  title: 'Resources — Optimal Mocktail',
  description: 'Helpful articles and resources from Optimal Mocktail.',
}

export const dynamic = 'force-dynamic'

interface Resource {
  _id: string
  title: string
  slug: { current: string }
  image?: any
  publishedAt?: string
  author?: string
}

async function getResources(): Promise<Resource[]> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here'
    ) {
      return []
    }

    const preview = await isPreviewEnabled()

    const resources = await sanityClient(preview).fetch(
      `*[_type == "post" ${!preview ? '&& defined(publishedAt)' : ''} && resource == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        image,
        publishedAt,
        author
      }`
    )
    return resources
  } catch (error) {
    console.error('Error fetching resources:', error)
    return []
  }
}

export default async function ResourcesPage() {
  const resources = await getResources()
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

      <h1 className="mb-8 text-3xl font-bold text-navy sm:text-4xl">Resources</h1>

      {resources.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources
            .filter((resource) => resource.slug?.current)
            .map((resource) => (
              <div
                key={resource._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/posts/${resource.slug.current}`} className="flex flex-col">
                  {resource.image?.asset ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={urlForImage(resource.image).width(800).height(450).fit('crop').url()}
                        alt={resource.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-cream" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-bold text-navy transition group-hover:text-accent">
                      {resource.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-sm text-navy-700/80">
                      {resource.publishedAt && (
                        <span>{new Date(resource.publishedAt).toLocaleDateString()}</span>
                      )}
                      {resource.author && (
                        <span className="font-byline text-lg leading-none text-accent">
                          by {resource.author}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
