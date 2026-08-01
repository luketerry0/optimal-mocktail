import type { Metadata } from 'next'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity.client'
import { isPreviewEnabled } from '@/lib/draft-mode'
import { urlForImage } from '@/lib/sanity.image'

export const metadata: Metadata = {
  title: 'Shop — Optimal Mocktail',
  description: 'Shop our favorite mocktail gear and ingredients.',
}

export const dynamic = 'force-dynamic'

interface Product {
  _id: string
  title: string
  link: string
  photo?: any
  order?: number
}

async function getProducts(): Promise<Product[]> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here'
    ) {
      return []
    }

    const preview = await isPreviewEnabled()

    const products = await sanityClient(preview).fetch(
      `*[_type == "product" ${!preview ? '&& defined(publishedAt)' : ''}] | order(order asc, title asc) {
        _id,
        title,
        link,
        photo,
        order
      }`
    )
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ShopPage() {
  const products = await getProducts()
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

      <h1 className="mb-8 text-3xl font-bold text-navy sm:text-4xl">Shop</h1>

      {products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <a
              key={product._id}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {product.photo?.asset ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={urlForImage(product.photo).width(600).height(375).fit('crop').url()}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] w-full bg-cream" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold text-navy transition group-hover:text-accent">
                  {product.title}
                </h2>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
