import { createClient } from '@sanity/client'

let cachedPublicClient: ReturnType<typeof createClient> | null = null
let cachedPreviewClient: ReturnType<typeof createClient> | null = null
let cachedWriteClient: ReturnType<typeof createClient> | null = null

function getPublicClient() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here') {
    throw new Error('Sanity not configured. Please set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
  }

  if (!cachedPublicClient) {
    cachedPublicClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-01',
      useCdn: true,
    })
  }

  return cachedPublicClient
}

function getPreviewClient() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here') {
    throw new Error('Sanity not configured')
  }

  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN not set. Cannot enable preview mode.')
  }

  if (!cachedPreviewClient) {
    cachedPreviewClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-01',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
      perspective: 'drafts',
    })
  }

  return cachedPreviewClient
}

export function sanityClient(preview = false) {
  return preview ? getPreviewClient() : getPublicClient()
}

export function sanityWriteClient() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_project_id_here') {
    throw new Error('Sanity not configured')
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('SANITY_API_WRITE_TOKEN not set. Cannot write comments.')
  }

  if (!cachedWriteClient) {
    cachedWriteClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-01',
      useCdn: false,
      token: process.env.SANITY_API_WRITE_TOKEN,
    })
  }

  return cachedWriteClient
}
