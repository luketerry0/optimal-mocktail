import { defineType, defineField } from 'sanity'

export const youtubeType = defineType({
  name: 'youtube',
  title: 'YouTube Video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description: 'Paste a full YouTube video link (e.g. https://www.youtube.com/watch?v=...)',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({ url }) {
      return {
        title: 'YouTube Video',
        subtitle: url,
      }
    },
  },
})
