'use client'
import { useRouter } from 'next/navigation'

interface TagSelectProps {
  tags: [string, number][]
}

export default function TagSelect({ tags }: TagSelectProps) {
  const router = useRouter()

  const handleTagSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = event.target.value
    if (selectedTag) {
      router.push(`/blog/tag/${encodeURIComponent(selectedTag)}`)
    }
  }

  return (
    <select className="border rounded px-3 py-2 w-full" onChange={handleTagSelect} defaultValue="">
      <option value="">Select Tag</option>
      {tags.map(([tag, count]) => (
        <option key={tag} value={tag}>
          {tag} ({count})
        </option>
      ))}
    </select>
  )
}
