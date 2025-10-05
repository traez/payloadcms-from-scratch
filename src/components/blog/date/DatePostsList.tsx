// src/components/blog/date/DatePostsList.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'
import { fetchPostsByDate } from '@/actions/fetchPostsByDate'
import { Post } from '@/payload-types'

interface PaginationProps {
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPageNum: number | null
  nextPageNum: number | null
  loadingPrev: boolean
  loadingNext: boolean
  onGoToPage: (targetPage: number, type: 'prev' | 'next') => void
  className?: string
}

function PaginationButtons(props: PaginationProps) {
  const {
    hasPrevPage,
    hasNextPage,
    prevPageNum,
    nextPageNum,
    loadingPrev,
    loadingNext,
    onGoToPage,
    className = '',
  } = props

  return (
    <nav className={`flex gap-4 ${className}`}>
      <button
        onClick={() => prevPageNum && onGoToPage(prevPageNum, 'prev')}
        disabled={!hasPrevPage || loadingPrev}
        className={`cursor-pointer px-4 py-2 rounded text-white flex items-center justify-center min-w-[110px] ${
          hasPrevPage && !loadingPrev
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {loadingPrev ? 'Loading...' : 'Prev Page'}
      </button>
      <button
        onClick={() => nextPageNum && onGoToPage(nextPageNum, 'next')}
        disabled={!hasNextPage || loadingNext}
        className={`cursor-pointer px-4 py-2 rounded text-white flex items-center justify-center min-w-[110px] ${
          hasNextPage && !loadingNext
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-blue-300 cursor-not-allowed'
        }`}
      >
        {loadingNext ? 'Loading...' : 'Next Page'}
      </button>
    </nav>
  )
}

export default function DatePostsList({
  initialPosts,
  initialPage,
  totalPages,
  totalPosts,
  dateSlug,
}: {
  initialPosts: Post[]
  initialPage: number
  totalPages: number
  totalPosts: number
  dateSlug: string
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

      const res = await fetchPostsByDate(dateSlug, targetPage)
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

  const paginationProps = {
    hasPrevPage,
    hasNextPage,
    prevPageNum,
    nextPageNum,
    loadingPrev,
    loadingNext,
    onGoToPage: goToPage,
  }

  return (
    <article className="space-y-6 w-full">
      <div className="text-4xl font-bold mb-6 flex items-center justify-between">
        <div>
          <h1>Posts published in: {dateSlug}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {totalPosts} post{totalPosts !== 1 ? 's' : ''}
          </p>
        </div>
        <b className="text-lg text-gray-600">
          Page {page} of {totalPages}
        </b>
      </div>

      {totalPages > 1 && <PaginationButtons {...paginationProps} />}

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
        </Link>
      ))}

      {totalPages > 1 && <PaginationButtons {...paginationProps} />}

      <div className="border-t pt-6 mt-8">
        <Link
          href="/blog/date"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Browse All Dates
        </Link>
      </div>
    </article>
  )
}
