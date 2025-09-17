import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'
import { admin } from '@/access/admin'
import { editor } from '@/access/editor'

// Slug helper
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

type TagItem = { tag: string }

const generateSlugAndPublishedAt: CollectionBeforeValidateHook = async ({
  data = {},
  operation,
  originalDoc,
}) => {
  // Slug
  if (data.title && !data.slug) {
    data.slug = slugify(data.title)
  }

  if (operation === 'update' && originalDoc?.slug) {
    data.slug = originalDoc.slug
  }

  // PublishedAt
  if (data.published && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  // Tags
  if (data.tags && Array.isArray(data.tags)) {
    data.tags = data.tags.map((t: TagItem) => {
      if (t.tag) {
        return { tag: slugify(t.tag) }
      }
      return t
    })
  }

  // Author
  if (data.author) {
    if (data.author.firstName) {
      data.author.firstName = slugify(data.author.firstName)
    }
    if (data.author.lastName) {
      data.author.lastName = slugify(data.author.lastName)
    }
  }

  return data
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'published', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true,
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200, // limit to 200 characters
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
      defaultValue: false, // default to draft
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: undefined, // will be set by hook if published
      admin: {
        position: 'sidebar',
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
    },
  ],
  hooks: {
    beforeValidate: [generateSlugAndPublishedAt],
  },
}
