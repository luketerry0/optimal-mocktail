import { defineType, defineField } from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Hero heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Hero subheading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Call-to-action heading',
      type: 'string',
    }),
    defineField({
      name: 'ctaText',
      title: 'Call-to-action text',
      type: 'string',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'Call-to-action button label',
      type: 'string',
      initialValue: 'Browse Recipes',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
})
