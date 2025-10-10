// src/app/(frontend)/(pages)/blog/[slug]/page.tsx
import Link from 'next/link'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import { Post } from '@/payload-types'
import RichTextRenderer from '@/components/blog/RichTextRenderer'

interface BlogSlugPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  // Await the params
  const { slug } = await params

  const payload = await getPayload({ config })

  // Fetch the specific post by slug
  const res = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      published: { equals: true },
    },
    depth: 2, // Ensure uploads and related data are fully populated
    limit: 1,
  })

  if (!res.docs.length) {
    notFound()
  }

  const post: Post = res.docs[0]

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Post header */}
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>

        {post.excerpt && <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>}

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t">
          {post.author && (
            <div className="flex items-center gap-1">
              <span>By</span>
              <Link
                href={`/blog/author/${encodeURIComponent(
                  `${post.author.firstName}-${post.author.lastName}`.toLowerCase(),
                )}`}
                className="font-medium text-gray-700 capitalize hover:text-blue-600 transition-colors"
              >
                {post.author.firstName} {post.author.lastName}
              </Link>
            </div>
          )}

          {post.publishedAt && (
            <div className="flex items-center gap-1">
              <span>Published</span>
              <time dateTime={post.publishedAt} className="font-medium text-gray-700">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          )}

          {post.updatedAt && (
            <div className="flex items-center gap-1">
              <span>Updated</span>
              <time dateTime={post.updatedAt} className="font-medium text-gray-700">
                {new Date(post.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tagItem, index) => (
              <Link
                key={index}
                href={`/blog/tag/${encodeURIComponent(tagItem?.tag || '')}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900 transition-colors"
              >
                #{tagItem?.tag || 'untitled'}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Post content */}
      <div className="prose prose-lg max-w-none">
        {post.content && <RichTextRenderer data={post.content} />}
      </div>
    </article>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogSlugPageProps) {
  // Await the params here too
  const { slug } = await params

  const payload = await getPayload({ config })

  const res = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      published: { equals: true },
    },
    limit: 1,
  })

  if (!res.docs.length) {
    return {
      title: 'Post Not Found',
    }
  }

  const post: Post = res.docs[0]

  return {
    title: `${post.title}: Blog - PayloadCMS From Scratch`,
    description:
      post.excerpt || `Read ${post.title} by ${post.author?.firstName} ${post.author.lastName}`,
    authors: post.author
      ? [
          {
            name: `${post.author.firstName} ${post.author.lastName}`,
          },
        ]
      : undefined,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    keywords: post.tags
      ?.map((tag) => tag?.tag)
      .filter(Boolean)
      .join(', '),
  }
}
