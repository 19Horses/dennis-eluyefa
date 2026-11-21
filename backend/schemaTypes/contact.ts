import {defineField, defineType} from 'sanity'

export const contactType = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      description: 'Shown in both inquiry blocks.',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'inquiriesText',
      type: 'text',
      rows: 4,
      description:
        'Top / left copy. Wrap words to underline like **business**. Email is appended automatically.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thanksMessage',
      type: 'string',
      description: 'Centre line (e.g. THANKS FOR STOPPING BY :))',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'printText',
      type: 'text',
      rows: 4,
      description:
        'Bottom / right print inquiry copy. Wrap words to underline like **print**. Email is inserted automatically where you write {{email}}.',
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
