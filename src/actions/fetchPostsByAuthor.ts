// src/actions/fetchPostsByAuthor.ts
'use server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function fetchPostsByAuthor(authorName: string, page: number = 1, limit = 10) {
  const payload = await getPayload({ config })

  // Split authorName into first and last names
  const [firstName, lastName] = authorName.split(' ')

  const res = await payload.find({
    collection: 'posts',
    limit,
    page,
    sort: '-publishedAt',
    where: {
      and: [
        { published: { equals: true } },
        { 'author.firstName': { equals: firstName } },
        { 'author.lastName': { equals: lastName } },
      ],
    },
    depth: 2,
  })

  return res
}
