// src/app/(frontend)/(pages)/blog/date/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { fetchPostsByDate } from '@/actions/fetchPostsByDate'
import DatePostsList from '@/components/blog/date/DatePostsList'

interface DateSlugPageProps {
  params: Promise<{ slug: string }>
}

export default async function DateSlugpage({ params }: DateSlugPageProps) {
  const { slug: dateSlug } = await params

  // Fetch first page of posts for this date
  const res = await fetchPostsByDate(dateSlug, 1, 10)

  if (res.docs.length === 0) {
    notFound()
  }

  return (
    <DatePostsList
      initialPosts={res.docs}
      initialPage={res.page!}
      totalPages={res.totalPages!}
      totalPosts={res.totalDocs}
      dateSlug={dateSlug}
    />
  )
}

// Optional: metadata generation
export async function generateMetadata({ params }: DateSlugPageProps) {
  const { slug: dateSlug } = await params

  const res = await fetchPostsByDate(dateSlug, 1, 1) // just need count
  const postCount = res.totalDocs

  return {
    title: `${dateSlug} - Blog - Payload From Scratch`,
    description: `Browse ${postCount} blog post${postCount !== 1 ? 's' : ''} published in ${dateSlug}.`,
    keywords: dateSlug,
  }
}
