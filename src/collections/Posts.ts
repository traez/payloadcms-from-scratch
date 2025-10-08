//src\collections\Posts.ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { revalidatePosts, revalidatePostsAfterDelete } from '@/hooks/revalidatePosts'
import { generateSlugAndPublishedAt } from '@/hooks/generateSlugAndPublishedAt'
import { admin } from '@/access/admin'
import { editor } from '@/access/editor'
import { ImageBlock } from '@/blocks/ImageBlock'
import { VideoBlock } from '@/blocks/VideoBlock'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'published', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true, //setting to read: viewer, would mean ean only logged in users(viewers) can view
    update: editor,
    create: admin,
    delete: admin,
  },
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'A short summary or teaser (max 200 characters)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      labels: { singular: 'Tag', plural: 'Tags' },
      admin: { description: 'Simple text tags for filtering' },
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: undefined,
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
      },
    },
    {
      name: 'author',
      type: 'group',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [ImageBlock, VideoBlock],
          }),
        ],
      }),
    },
  ],
  hooks: {
    beforeValidate: [generateSlugAndPublishedAt],
    afterChange: [revalidatePosts],
    afterDelete: [revalidatePostsAfterDelete],
  },
}
