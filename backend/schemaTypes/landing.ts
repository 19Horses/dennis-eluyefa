import {defineField, defineType} from 'sanity'

export const landingType = defineType({
  name: 'landing',
  title: 'Landing',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [{type: 'image'}],
      validation: (rule) => rule.required(),
    }),
  ],
})
