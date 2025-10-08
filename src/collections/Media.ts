import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    update: admin,
    create: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
