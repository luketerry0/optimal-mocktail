import { createImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
})

type ImageSource = Parameters<typeof builder.image>[0]

export function urlForImage(source: ImageSource) {
  // Let Sanity auto-pick the best format (WebP/AVIF) per browser.
  return builder.image(source).auto('format')
}
