import { defineType, defineField } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Shop Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description:
        'Lower numbers are displayed first. Ties are broken alphabetically by title.',
      initialValue: 0,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      readOnly: true,
      description:
        'Automatically set the first time this product is published. Unpublished products appear only on the preview site.',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      media: 'photo',
    },
    prepare({ title, order, media }) {
      return {
        title,
        subtitle: order != null ? `Order: ${order}` : undefined,
        media,
      }
    },
  },
})
