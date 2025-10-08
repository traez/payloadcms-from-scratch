//src\components\blog\tag\TagSelect.tsx
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'

interface TagSelectProps {
  tags: [string, number][]
}

export default function TagSelect({ tags }: TagSelectProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Get tag from current route
  const currentTag = pathname?.startsWith('/blog/tag/')
    ? decodeURIComponent(pathname.split('/blog/tag/')[1])
    : ''

  // Track local selection for instant UI updates
  const [selectedTag, setSelectedTag] = useState(currentTag)

  // Sync with route if user navigates by other means
  useEffect(() => {
    setSelectedTag(currentTag)
  }, [currentTag])

  const handleTagSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = event.target.value
    setSelectedTag(newTag) // instant visual feedback
    if (newTag) {
      router.push(`/blog/tag/${encodeURIComponent(newTag)}`)
    }
  }

  return (
    <select
      className="border rounded px-3 py-2 w-full"
      onChange={handleTagSelect}
      value={selectedTag}
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
