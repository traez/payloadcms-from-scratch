// src/components/blog/author/BlogSidebarAuthor.tsx
import Link from 'next/link'
import { getSortedAuthors } from '@/actions/getSortedAuthors'
import AuthorSelect from './AuthorSelect'

export default async function BlogSidebarAuthor() {
  const sortedAuthors = await getSortedAuthors()

  return (
    <aside className="flex flex-col gap-2">
      <Link
        href="/blog/author"
        className="px-3 py-2 rounded text-center bg-green-500 text-white hover:bg-green-600"
      >
        Author Home
      </Link>

      <AuthorSelect authors={sortedAuthors} />
    </aside>
  )
}
