// src/app/(frontend)/(pages)/blog/author/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getSortedAuthors } from '@/lib/getSortedAuthors'

export const metadata: Metadata = {
  description: 'Browse all blog post authors - Created by Trae Zeeofor',
  title: 'All Authors - Blog - Payload From Scratch',
}

export default async function Authorpage() {
  const sortedAuthors = await getSortedAuthors()

  return (
    <article className="space-y-6 w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Authors</h1>
        <p className="text-gray-600">
          Browse posts by author. Found {sortedAuthors.length} author
          {sortedAuthors.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/blog" className="hover:text-blue-600 transition-colors">
          Blog
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-800">Authors</span>
      </nav>

      {sortedAuthors.length === 0 && <p className="text-gray-600">No authors found.</p>}

      <ul className="flex flex-wrap gap-3">
        {sortedAuthors.map(([author, count]) => (
          <li key={author}>
            <Link
              href={`/blog/author/${encodeURIComponent(author)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition text-sm border hover:border-2 hover:border-black group"
            >
              <span className="font-medium">{author}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs group-hover:bg-gray-200 transition-colors">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Back to blog link */}
      <div className="border-t pt-6 mt-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Back to All Posts
        </Link>
      </div>
    </article>
  )
}
