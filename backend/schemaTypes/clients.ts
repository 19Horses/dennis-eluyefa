import {defineField, defineType} from 'sanity'

export const clientsList = defineType({
  name: 'clientsList',
  title: 'Clients List',
  type: 'document',
  fields: [
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        sortable: true,
      },
    }),
  ],
})
