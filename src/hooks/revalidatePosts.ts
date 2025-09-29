// src/hooks/revalidatePosts.ts
import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidatePosts: CollectionAfterChangeHook = async ({ doc }) => {
  revalidateTag('tags')
  revalidateTag('authors')
  return doc
}

export const revalidatePostsAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  revalidateTag('tags')
  revalidateTag('authors')
  return doc
}
