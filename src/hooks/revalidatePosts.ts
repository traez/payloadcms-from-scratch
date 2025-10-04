// src/hooks/revalidatePosts.ts
import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Post } from '@/payload-types'

// central invalidate logic
async function invalidatePostData(doc?: Post) {
  // collection-wide invalidation
  revalidateTag('posts')
  revalidateTag('tags')
  revalidateTag('authors')

  // individual post invalidation
  if (doc?.slug) {
    revalidateTag(`post-${doc.slug}`)
  }
}

export const revalidatePosts: CollectionAfterChangeHook = async ({ doc }) => {
  await invalidatePostData(doc as Post)
  return doc
}

export const revalidatePostsAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await invalidatePostData(doc as Post)
  return doc
}
