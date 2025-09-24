'use client'
import Link from 'next/link'
import { Post } from '@/payload-types'
import { useState } from 'react'
import { fetchPosts } from '@/lib/actions'

export default function PostsList({
  initialPosts,
  initialPage,
  totalPages,
}: {
  initialPosts: Post[]
  initialPage: number
  totalPages: number
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

      const res = await fetchPosts(targetPage)
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
        <h1>Latest Blog Posts</h1>
        <b className="text-lg font-normal text-gray-600">
          Page {page} of {totalPages}
        </b>
      </div>

      {currentPosts.length === 0 && <p className="text-gray-600">No posts available.</p>}

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
              <p>Tags: {post.tags.map((t) => t?.tag ?? 'untitled').join(', ')}</p>
            </div>
          )}
        </Link>
      ))}
      {/* Page buttons */}
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
    </article>
  )
}
