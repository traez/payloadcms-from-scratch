// src\app\(frontend)\(pages)\blog\date\page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getSortedDates } from '@/actions/getSortedDates'

export const metadata: Metadata = {
  title: 'All Dates - Blog - PayloadCMS From Scratch',
  description: 'Browse blog posts by publication date - Created by Trae Zeeofor',
}

export default async function Datepage() {
  const sortedDates = await getSortedDates()

  return (
    <article className="space-y-6 w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Dates</h1>
        <p className="text-gray-600">
          Browse posts by month. Found {sortedDates.length} date
          {sortedDates.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/blog" className="hover:text-blue-600 transition-colors">
          Blog
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-800">Dates</span>
      </nav>

      {sortedDates.length === 0 && <p className="text-gray-600">No dates found.</p>}

      <ul className="flex flex-wrap gap-3">
        {sortedDates.map(([key, { label, count }]) => (
          <li key={key}>
            <Link
              href={`/blog/date/${key}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition text-sm border hover:border-2 hover:border-black group"
            >
              <span className="font-medium">{label}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs group-hover:bg-gray-200 transition-colors">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>

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
