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

export const generateSlugAndPublishedAt: CollectionBeforeValidateHook = async ({ data = {} }) => {
  // Always regenerate slug from title
  if (data.title) {
    data.slug = slugify(data.title)
  }

  // PublishedAt
  if (data.published && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  // Tags
  if (Array.isArray(data.tags)) {
    data.tags = data.tags.map((t: TagItem) => (t.tag ? { tag: slugify(t.tag) } : t))
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
