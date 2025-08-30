import { Block } from 'payload'

export const NewsletterForm: Block = {
  slug: 'newsletter-form',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: false,
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
}