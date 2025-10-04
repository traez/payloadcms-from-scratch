// src\actions\getSortedAuthors.ts
'use server'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const getSortedAuthors = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    // Fetch only published posts
    const res = await payload.find({
      collection: 'posts',
      limit: 1000, // adjust depending on expected volume
      where: { published: { equals: true } },
    })

    // Collect authors with their counts
    const authorCounts = res.docs
      .map((post) => {
        const author = post.author
        if (author?.firstName && author?.lastName) {
          return `${author.firstName} ${author.lastName}`
        }
        return null
      })
      .filter((name): name is string => !!name)
      .reduce(
        (acc, name) => {
          acc[name] = (acc[name] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    // Sort alphabetically
    return Object.entries(authorCounts).sort(([a], [b]) => a.localeCompare(b))
  },
  ['sorted-authors'], // cache key
  {
    tags: ['authors'], // use a tag for invalidation
    revalidate: 300, // refresh every 5 mins
  },
)
