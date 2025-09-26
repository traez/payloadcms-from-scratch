// src/app/(frontend)/(pages)/blog/tag/[slug]/page.tsx
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import TagPostsList from '@/components/blog/TagPostsList'

interface TagSlugPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TagSlugpage({ params }: TagSlugPageProps) {
  // Await the params
  const { slug } = await params

  const payload = await getPayload({ config })

  // Decode the slug in case it has special characters eg ("web%20dev") becomes "web dev"
  const decodedTag = decodeURIComponent(slug)

  // Fetch posts with the specific tag
  const res = await payload.find({
    collection: 'posts',
    limit: 10,
    page: 1,
    sort: '-publishedAt',
    where: {
      and: [
        { published: { equals: true } },
        {
          'tags.tag': {
            equals: decodedTag,
          },
        },
      ],
    },
    depth: 2, // Ensure tags and author data are populated
  })

  // If no posts found with this tag, show 404
  if (res.docs.length === 0) {
    notFound()
  }

  return (
    <TagPostsList
      initialPosts={res.docs}
      initialPage={res.page!}
      totalPages={res.totalPages!}
      totalPosts={res.totalDocs}
      tag={decodedTag}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TagSlugPageProps) {
  const { slug } = await params
  const decodedTag = decodeURIComponent(slug)

  const payload = await getPayload({ config })

  // Get count of posts with this tag
  const res = await payload.find({
    collection: 'posts',
    limit: 1,
    where: {
      and: [
        { published: { equals: true } },
        {
          'tags.tag': {
            equals: decodedTag,
          },
        },
      ],
    },
  })

  const postCount = res.totalDocs

  return {
    title: `${decodedTag} Tag - Blog - Payload From Scratch`,
    description: `Browse ${postCount} blog post${postCount !== 1 ? 's' : ''} tagged with "${decodedTag}". Discover articles and insights on this topic.`,
    keywords: decodedTag,
  }
}
