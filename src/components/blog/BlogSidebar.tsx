//src\components\blog\BlogSidebar.tsx
import Link from 'next/link'
import BlogSidebarTag from '@/components/blog/tag/BlogSidebarTag'
import BlogSidebarAuthor from '@/components/blog/author/BlogSidebarAuthor'

export default function BlogSidebar() {
  return (
    <section className="flex flex-col gap-4 mb-6 lg:mb-0 lg:w-1/4">
      {/* Tags */}
      <BlogSidebarTag />

      {/* Author */}
      <BlogSidebarAuthor />

      {/* Date */}
      <aside className="flex flex-col gap-2">
        <Link
          href="/blog/date"
          className="px-3 py-2 rounded text-center bg-purple-500 text-white hover:bg-purple-600"
        >
          Date Home
        </Link>
        <select className="border rounded px-3 py-2 w-full">
          <option value="">Select Date</option>
          <option value="2025-09">Sep 2025</option>
          <option value="2025-10">Oct 2025</option>
        </select>
      </aside>
    </section>
  )
}
