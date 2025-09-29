// src/hooks/generateSlugAndPublishedAt.ts
import type { CollectionBeforeValidateHook } from 'payload'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

type TagItem = { tag: string }

export const generateSlugAndPublishedAt: CollectionBeforeValidateHook = async ({
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
