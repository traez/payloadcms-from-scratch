import type { CollectionConfig } from 'payload'
import { Hero } from '@/blocks/Hero'
import { Content } from '@/blocks/Content'
import { NewsletterForm } from '@/blocks/NewsletterForm'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [Hero, Content, NewsletterForm],
    },
  ],
}