'use server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function fetchPosts(page: number, limit = 10) {
  const payload = await getPayload({ config })

  const res = await payload.find({
    collection: 'posts',
    limit,
    page,
    sort: '-publishedAt',
    where: { published: { equals: true } },
  })

  return res
}
