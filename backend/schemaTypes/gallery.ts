import {defineArrayMember, defineField, defineType} from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      type: 'array',
      of: [defineArrayMember({type: 'image'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
})
