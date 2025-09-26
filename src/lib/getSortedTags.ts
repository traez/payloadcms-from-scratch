// src/lib/getSortedTags.ts
'use server'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Define the cached function
export const getSortedTags = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    // Fetch only published posts
    const res = await payload.find({
      collection: 'posts',
      limit: 1000, // adjust depending on expected volume
      where: { published: { equals: true } },
    })

    // Collect tags from posts with their counts
    const tagCounts = res.docs
      .flatMap((post) => post.tags?.map((t) => t?.tag).filter(Boolean) || [])
      .filter((tag): tag is string => !!tag)
      .reduce(
        (acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    // Sort alphabetically
    return Object.entries(tagCounts).sort(([a], [b]) => a.localeCompare(b))
  },
  ['sorted-tags'], // cache key parts
  {
    tags: ['tags'], // use a tag for invalidation
    revalidate: 300, // refresh every 5 mins
  },
)
