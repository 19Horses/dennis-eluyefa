import {defineField, defineType} from 'sanity'

export const contactType = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'printEmail',
      title: 'Print email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'inquiriesText',
      title: 'Inquiries text',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thanksMessage',
      title: 'Thanks message',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'printText',
      title: 'Print text',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'thanksMessage',
      subtitle: 'email',
    },
  },
})
