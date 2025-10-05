// src/app/(frontend)/(pages)/blog/tag/page.tsx 
import type { Metadata } from 'next'
import Link from 'next/link'
import { getSortedTags } from '@/actions/getSortedTags'

export const metadata: Metadata = {
  description: 'Browse all blog post tags - Created by Trae Zeeofor',
  title: 'All Tags - Blog - Payload From Scratch',
}

export default async function Tagpage() {
  const sortedTags = await getSortedTags()

  return (
    <article className="space-y-6 w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Tags</h1>
        <p className="text-gray-600">
          Browse posts by topic. Found {sortedTags.length} tag{sortedTags.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/blog" className="hover:text-blue-600 transition-colors">
          Blog
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-800">Tags</span>
      </nav>

      {sortedTags.length === 0 && <p className="text-gray-600">No tags found.</p>}

      <ul className="flex flex-wrap gap-3">
        {sortedTags.map(([tag, count]) => (
          <li key={tag}>
            <Link
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition text-sm border hover:border-2 hover:border-black group"
            >
              <span className="font-medium">{tag}</span>
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
