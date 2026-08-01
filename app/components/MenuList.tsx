import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity.image'

export interface MenuItem {
  _id: string
  title: string
  slug: { current: string }
  image?: any
  publishedAt?: string
  author?: string
  featured?: boolean
}

/**
 * Renders recipes as entries on a fancy cocktail-bar menu: each row has the
 * title and a dotted "leader" line running to the meta on the right.
 */
export function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <div className="menu-card rounded-sm px-5 py-6 sm:px-10 sm:py-10">
      <div className="relative z-10 divide-y-0">
        {items
          .filter((item) => item.slug?.current)
          .map((item) => (
          <Link
            key={item._id}
            href={`/posts/${item.slug.current}`}
            className="menu-row group flex flex-col items-center gap-3 py-5 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left"
          >
            {item.image?.asset ? (
              <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/50 sm:block">
                <Image
                  src={urlForImage(item.image).width(160).height(160).fit('crop').url()}
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover transition duration-300 group-hover:scale-110"
                />
              </div>
            ) : (
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-cream ring-1 ring-gold/30 sm:flex">
                <span className="font-jersey text-2xl text-gold/60">✦</span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              {item.featured && (
                <span className="menu-label mb-1 block text-[0.6rem] text-gold sm:hidden">
                  ★ Signature
                </span>
              )}
              <div className="flex items-baseline justify-center gap-3 sm:justify-start">
                <h3 className="shrink-0 font-display text-xl font-semibold text-navy transition group-hover:text-accent sm:text-2xl">
                  {item.title}
                </h3>
                <span className="menu-leader mb-1 hidden min-w-6 flex-1 sm:block" aria-hidden="true" />
                {item.featured && (
                  <span className="menu-label hidden shrink-0 text-[0.6rem] text-gold sm:inline">
                    ★ Signature
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center justify-center gap-3 text-sm text-navy-700/80 sm:justify-start">
                {item.publishedAt && (
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                )}
                {item.author && (
                  <span className="font-byline text-lg leading-none text-accent">
                    by {item.author}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
