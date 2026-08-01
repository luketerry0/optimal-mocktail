import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schema'
import { PublishWithTimestamp } from './sanity/actions/PublishWithTimestamp'

const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

export default defineConfig({
  name: 'optimal-mocktail-cms',
  title: 'Optimal Mocktail',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) =>
      context.schemaType === 'post' || context.schemaType === 'product'
        ? prev.map((action) =>
            action.action === 'publish' ? PublishWithTimestamp : action
          )
        : prev,
  },
  previewUrl: {
    draftMode: {
      enable: `${previewUrl}/api/draft-mode?secret=${process.env.NEXT_PUBLIC_PREVIEW_SECRET}`,
    },
  },
})
