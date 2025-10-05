// src/app/(frontend)/(pages)/blog/author/[slug]/page.tsx
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import AuthorPostsList from '@/components/blog/author/AuthorPostsList'

interface AuthorSlugPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function AuthorSlugpage({ params }: AuthorSlugPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Decode and replace hyphens with spaces
  const decodedAuthorName = decodeURIComponent(slug).replace(/-/g, ' ')

  // Split into first and last name
  const nameParts = decodedAuthorName.trim().split(/\s+/)
  const firstName = nameParts[0]?.toLowerCase() || ''
  const lastName = nameParts.slice(1).join(' ').toLowerCase() || ''

  // Search for specific author (case-insensitive by using lowercase)
  const res = await payload.find({
    collection: 'posts',
    limit: 10,
    page: 1,
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

  // If no posts found by this author, show 404
  if (res.docs.length === 0) {
    notFound()
  }

  // Get the actual author name from the first post for display
  const displayName = res.docs[0].author
    ? `${res.docs[0].author.firstName} ${res.docs[0].author.lastName}`
    : decodedAuthorName

  return (
    <AuthorPostsList
      initialPosts={res.docs}
      initialPage={res.page!}
      totalPages={res.totalPages!}
      totalPosts={res.totalDocs}
      authorName={displayName}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AuthorSlugPageProps) {
  const { slug } = await params
  const decodedAuthorName = decodeURIComponent(slug).replace(/-/g, ' ')
  const payload = await getPayload({ config })

  const nameParts = decodedAuthorName.trim().split(/\s+/)
  const firstName = nameParts[0]?.toLowerCase() || ''
  const lastName = nameParts.slice(1).join(' ').toLowerCase() || ''

  const res = await payload.find({
    collection: 'posts',
    limit: 1,
    where: {
      and: [
        { published: { equals: true } },
        { 'author.firstName': { equals: firstName } },
        { 'author.lastName': { equals: lastName } },
      ],
    },
  })

  const postCount = res.totalDocs

  // Capitalize for display
  const displayName = nameParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')

  return {
    title: `${displayName} - Author - Blog - Payload From Scratch`,
    description: `Browse ${postCount} blog post${postCount !== 1 ? 's' : ''} written by ${displayName}. Discover articles and insights from this author.`,
    keywords: `${displayName}, author, blog posts`,
  }
}
