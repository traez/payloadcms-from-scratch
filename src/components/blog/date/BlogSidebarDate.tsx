//src\components\blog\date\BlogSidebarDate.tsx
import Link from 'next/link'
import { getSortedDates } from '@/actions/getSortedDates'
import DateSelect from './DateSelect'

export default async function BlogSidebarDate() {
  const sortedDates = await getSortedDates()

  // Each entry is [key, { label, count, timestamp }]
  const formattedDates = sortedDates.map(([key, { label, count }]) => ({
    key,
    label,
    count,
  }))

  return (
    <aside className="flex flex-col gap-2">
      <Link
        href="/blog/date"
        className="px-3 py-2 rounded text-center bg-purple-500 text-white hover:bg-purple-600"
      >
        Date Home
      </Link>

      <DateSelect dates={formattedDates} />
    </aside>
  )
}
