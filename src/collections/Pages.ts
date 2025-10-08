import type { CollectionConfig } from 'payload'
import { HeroBlock } from '@/blocks/HeroBlock'
import { ContentBlock } from '@/blocks/ContentBlock'
import { NewsletterFormBlock } from '@/blocks/NewsletterFormBlock'
import { admin } from '@/access/admin'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true, 
    update: admin,
    create: admin,
    delete: admin,
  },
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
      blocks: [HeroBlock, ContentBlock, NewsletterFormBlock],
    },
  ],
}