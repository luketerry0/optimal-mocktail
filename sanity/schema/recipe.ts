import { defineType, defineField } from 'sanity'

export const recipeType = defineType({
  name: 'recipe',
  title: 'Recipe Card',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Recipe Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'servings',
      title: 'Servings / Yield',
      type: 'string',
      description: 'e.g. "4 drinks" or "Serves 2"',
    }),
    defineField({
      name: 'prepMinutes',
      title: 'Prep time (minutes)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'cookMinutes',
      title: 'Cook time (minutes)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'array',
      of: [{ type: 'text', rows: 2 }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related recipes',
      type: 'array',
      description: 'Link to other posts shown as chips at the bottom of the card',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      servings: 'servings',
    },
    prepare({ title, servings }) {
      return {
        title: `🍹 ${title || 'Recipe'}`,
        subtitle: servings,
      }
    },
  },
})
