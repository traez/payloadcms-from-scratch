// src/actions/getSortedDates.ts
'use server'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const getSortedDates = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const res = await payload.find({
      collection: 'posts',
      limit: 1000,
      where: { published: { equals: true } },
      sort: '-publishedAt',
    })

    const dateCounts = res.docs.reduce(
      (acc, post) => {
        if (!post.publishedAt) return acc

        const date = new Date(post.publishedAt)
        const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase()
        const year = date.getFullYear()
        const key = `${year}-${month}` // for URL
        const label = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}` // for display

        acc[key] = acc[key]
          ? { ...acc[key], count: acc[key].count + 1 }
          : { label, count: 1, timestamp: date.getTime() }

        return acc
      },
      {} as Record<string, { label: string; count: number; timestamp: number }>,
    )

    // Sort by timestamp descending
    const sorted = Object.entries(dateCounts).sort(
      ([_a, aVal], [_b, bVal]) => bVal.timestamp - aVal.timestamp,
    )

    return sorted
  },
  ['sorted-dates'],
  {
    tags: ['dates'],
    revalidate: 300,
  },
)
