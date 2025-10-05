//src\actions\fetchPostsByDate.ts
'use server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Fetch posts published in a specific month and year.
 * @param dateSlug - e.g. "2025-sep"
 * @param page - pagination page number
 * @param limit - posts per page
 */
export async function fetchPostsByDate(dateSlug: string, page = 1, limit = 10) {
  const payload = await getPayload({ config })

  // Parse "YYYY-mon" (e.g. "2025-sep")
  const [yearStr, monthStr] = dateSlug.split('-')
  const year = Number(yearStr)
  const monthIndex = new Date(`${monthStr} 1, ${year}`).getMonth() // 0–11

  if (isNaN(year) || isNaN(monthIndex)) {
    throw new Error(`Invalid dateSlug format: ${dateSlug}`)
  }

  // Define range: from start of month to start of next month
  const startDate = new Date(year, monthIndex, 1)
  const endDate = new Date(year, monthIndex + 1, 1)

  const res = await payload.find({
    collection: 'posts',
    limit,
    page,
    sort: '-publishedAt',
    where: {
      and: [
        { published: { equals: true } },
        { publishedAt: { greater_than_equal: startDate.toISOString() } },
        { publishedAt: { less_than: endDate.toISOString() } },
      ],
    },
    depth: 2,
  })

  return res
}
