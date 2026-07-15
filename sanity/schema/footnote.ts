import { defineType, defineField } from 'sanity'

export const footnoteType = defineType({
  name: 'footnote',
  title: 'Footnote',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Footnote text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Emphasis', value: 'em' },
              { title: 'Strong', value: 'strong' },
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
                      Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({ text }) {
      const block = (text || []).find(
        (b: { _type?: string }) => b._type === 'block'
      ) as { children?: { text?: string }[] } | undefined
      const plain =
        block?.children?.map((c) => c.text || '').join('') || 'Footnote'
      return { title: `† ${plain}` }
    },
  },
})
