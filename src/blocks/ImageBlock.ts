// blocks/ImageBlock.ts
import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media', // assumes you already have a Media collection
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
