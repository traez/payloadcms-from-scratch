// src/components/blog/author/AuthorSelect.tsx
'use client'
import { useRouter, usePathname } from 'next/navigation'

interface AuthorSelectProps {
  authors: [string, number][]
}

export default function AuthorSelect({ authors }: AuthorSelectProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine default selected value
  const defaultValue =
    pathname?.startsWith('/blog/author') && pathname.split('/blog/author/')[1]
      ? decodeURIComponent(pathname.split('/blog/author/')[1].replace(/-/g, ' '))
      : ''

  const handleAuthorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAuthor = event.target.value
    if (selectedAuthor) {
      // Convert "First Last" -> "first-last" for URL
      const slug = selectedAuthor.toLowerCase().replace(/\s+/g, '-')
      router.push(`/blog/author/${encodeURIComponent(slug)}`)
    }
  }

  return (
    <select
      className="border rounded px-3 py-2 w-full"
      onChange={handleAuthorSelect}
      value={defaultValue}
    >
      <option value="">Select Author</option>
      {authors.map(([author, count]) => (
        <option key={author} value={author}>
          {author} ({count})
        </option>
      ))}
    </select>
  )
}
