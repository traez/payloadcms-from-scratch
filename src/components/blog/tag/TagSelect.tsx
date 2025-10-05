//src\components\blog\tag\TagSelect.tsx
'use client'
import { useRouter, usePathname } from 'next/navigation'

interface TagSelectProps {
  tags: [string, number][]
}

export default function TagSelect({ tags }: TagSelectProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine default selected value
  const defaultValue = pathname?.startsWith('/blog/tag')
    ? decodeURIComponent(pathname.split('/blog/tag/')[1])
    : ''

  const handleTagSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = event.target.value
    if (selectedTag) {
      router.push(`/blog/tag/${encodeURIComponent(selectedTag)}`)
    }
  }

  return (
    <select
      className="border rounded px-3 py-2 w-full"
      onChange={handleTagSelect}
      value={defaultValue}
    >
      <option value="">Select Tag</option>
      {tags.map(([tag, count]) => (
        <option key={tag} value={tag}>
          {tag} ({count})
        </option>
      ))}
    </select>
  )
}
