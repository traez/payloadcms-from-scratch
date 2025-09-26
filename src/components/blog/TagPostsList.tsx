// src/components/blog/TagPostsList.tsx
'use client'
import Link from 'next/link'
import { Post } from '@/payload-types'
import { useState } from 'react'
import { fetchPostsByTag } from '@/lib/actions'

export default function TagPostsList({
  initialPosts,
  initialPage,
  totalPages,
  totalPosts,
  tag,
}: {
  initialPosts: Post[]
  initialPage: number
  totalPages: number
  totalPosts: number
  tag: string
}) {
  const [page, setPage] = useState(initialPage)
  const [currentPosts, setCurrentPosts] = useState<Post[]>(initialPosts)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(initialPage < totalPages)
  const [prevPageNum, setPrevPageNum] = useState<number | null>(null)
  const [nextPageNum, setNextPageNum] = useState<number | null>(initialPage + 1)
  const [loadingPrev, setLoadingPrev] = useState(false)
  const [loadingNext, setLoadingNext] = useState(false)

  async function goToPage(targetPage: number, type: 'prev' | 'next') {
    try {
      if (type === 'prev') setLoadingPrev(true)
      else setLoadingNext(true)

      const res = await fetchPostsByTag(tag, targetPage)
      setCurrentPosts(res.docs)
      setPage(res.page!)
      setHasPrevPage(res.hasPrevPage!)
      setHasNextPage(res.hasNextPage!)
      setPrevPageNum(res.prevPage!)
      setNextPageNum(res.nextPage!)
    } finally {
      setLoadingPrev(false)
      setLoadingNext(false)
    }
  }

  return (
    <article className="space-y-6 w-full">
      <div className="text-4xl font-bold mb-6 flex items-center justify-between">
        <div>
          <h1>Posts tagged: &quot;{tag}&quot;</h1>

          <p className="text-lg font-normal text-gray-600 mt-2">
            {totalPosts > 0
              ? `${totalPosts} post${totalPosts !== 1 ? 's' : ''} found`
              : 'No posts found'}
          </p>
        </div>
        <b className="text-lg font-normal text-gray-600">
          Page {page} of {totalPages}
        </b>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/blog" className="hover:text-blue-600 transition-colors">
          Blog
        </Link>
        <span>→</span>
        <Link href="/blog/tag" className="hover:text-blue-600 transition-colors">
          Tags
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-800">{tag}</span>
      </nav>

      {currentPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No posts found with the tag &quot;{tag}&quot;.</p>
          <Link
            href="/blog/tag"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Tags
          </Link>
        </div>
      )}

      {currentPosts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug ?? ''}`}
          className="block p-4 border hover:border-2 hover:border-black rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>

          {post.excerpt && <p className="text-gray-700 mb-3">{post.excerpt}</p>}

          <p className="text-sm text-gray-500 mb-1">
            Published:{' '}
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Unpublished'}
          </p>

          {post.author && (
            <p className="text-sm text-gray-600 mb-1 capitalize">
              By {post.author.firstName} {post.author.lastName}
            </p>
          )}

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="text-sm text-gray-500">
              <p>
                Tags:{' '}
                {post.tags.map((t, index) => (
                  <span key={index}>
                    <span className={`${t?.tag === tag ? 'font-semibold text-blue-600' : ''}`}>
                      {t?.tag ?? 'untitled'}
                    </span>
                    {index < post.tags!.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
          )}
        </Link>
      ))}

      {/* Page buttons - only show if there are multiple pages */}
      {totalPages > 1 && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => prevPageNum && goToPage(prevPageNum, 'prev')}
            disabled={!hasPrevPage || loadingPrev}
            className={`cursor-pointer px-4 py-2 rounded text-white flex items-center justify-center min-w-[110px] ${
              hasPrevPage && !loadingPrev
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loadingPrev ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </span>
            ) : (
              'Prev Page'
            )}
          </button>

          <button
            onClick={() => nextPageNum && goToPage(nextPageNum, 'next')}
            disabled={!hasNextPage || loadingNext}
            className={`cursor-pointer px-4 py-2 rounded text-white flex items-center justify-center min-w-[110px] ${
              hasNextPage && !loadingNext
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            {loadingNext ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </span>
            ) : (
              'Next Page'
            )}
          </button>
        </div>
      )}

      {/* Back to all tags link */}
      <div className="border-t pt-6 mt-8">
        <Link
          href="/blog/tag"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Browse All Tags
        </Link>
      </div>
    </article>
  )
}
