//src\components\blog\tag\BlogSidebarTag.tsx
import Link from 'next/link'
import { getSortedTags } from '@/actions/getSortedTags'
import TagSelect from './TagSelect'

export default async function BlogSidebarTag() {
  const sortedTags = await getSortedTags()

  return (
    <aside className="flex flex-col gap-2">
      <Link
        href="/blog/tag"
        className="px-3 py-2 rounded text-center bg-blue-500 text-white hover:bg-blue-600"
      >
        Tag Home
      </Link>

      <TagSelect tags={sortedTags} />
    </aside>
  )
}
