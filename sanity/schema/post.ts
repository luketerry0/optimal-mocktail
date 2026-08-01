import { defineType, defineField } from 'sanity'
import { AutoSlugInput } from '../components/AutoSlugInput'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      components: {
        input: AutoSlugInput,
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return 'A slug will be generated once you add a title'
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)
            ? true
            : 'Slug can only contain lowercase letters, numbers, and hyphens (no spaces).'
        }),
    }),
    defineField({
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      description:
        'Displayed in a 16:9 frame. For best results upload a landscape image around 1600×900px. Use the hotspot to set the focal point that stays centered when cropped.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          of: [{ type: 'footnote' }],
          marks: {
            annotations: [
              {
                name: 'internalLink',
                title: 'Internal link (to another post)',
                type: 'object',
                fields: [
                  {
                    name: 'reference',
                    title: 'Post',
                    type: 'reference',
                    to: [{ type: 'post' }],
                  },
                ],
              },
              {
                name: 'link',
                title: 'External link',
                type: 'object',
                fields: [
                  {
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          type: 'youtube',
        },
        {
          type: 'recipe',
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Set automatically the first time this recipe is published.',
      readOnly: true,
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Highlight this article as a featured recipe.',
      initialValue: false,
    }),
    defineField({
      name: 'alcoholSubstitute',
      title: 'Alcohol Substitute',
      type: 'boolean',
      description:
        'Turn on if this recipe is an alcohol substitute rather than a mocktail.',
      initialValue: false,
    }),
    defineField({
      name: 'resource',
      title: 'Show under Resources',
      type: 'boolean',
      description:
        'Turn on to show this article under the Resources tab instead of Recipes.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      date: 'publishedAt',
    },
  },
})
