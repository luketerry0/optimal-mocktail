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
      description:
        'Displayed in a 16:9 frame. For best results upload a landscape image around 1600×900px. Use the hotspot to set the focal point that stays centered when cropped.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description:
        'Optional paragraph shown under the image (max 240 characters, so all cards stay the same size). You can add external links to selected text.',
      validation: (Rule) =>
        Rule.custom((blocks) => {
          const MAX = 240
          const text = ((blocks as any[]) || [])
            .filter((block) => block?._type === 'block')
            .map((block) =>
              (block.children || [])
                .filter((child: any) => child?._type === 'span')
                .map((span: any) => span.text || '')
                .join('')
            )
            .join('\n')
          return text.length > MAX
            ? `Description must be ${MAX} characters or fewer (currently ${text.length}).`
            : true
        }),
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
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
                      Rule.required().uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
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
