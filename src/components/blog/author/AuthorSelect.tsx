// src/components/blog/author/AuthorSelect.tsx
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'

interface AuthorSelectProps {
  authors: [string, number][]
}

export default function AuthorSelect({ authors }: AuthorSelectProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Get current author name from URL
  const currentAuthor = pathname?.startsWith('/blog/author/')
    ? decodeURIComponent(pathname.split('/blog/author/')[1].replace(/-/g, ' '))
    : ''

  // Track local selection for instant visual feedback
  const [selectedAuthor, setSelectedAuthor] = useState(currentAuthor)

  // Sync with route if user navigates by other means
  useEffect(() => {
    setSelectedAuthor(currentAuthor)
  }, [currentAuthor])

  const handleAuthorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAuthor = event.target.value
    setSelectedAuthor(newAuthor) // immediate visual update
    if (newAuthor) {
      // Convert "First Last" -> "first-last" for URL
      const slug = newAuthor.toLowerCase().replace(/\s+/g, '-')
      router.push(`/blog/author/${encodeURIComponent(slug)}`)
    }
  }

  return (
    <select
      className="border rounded px-3 py-2 w-full"
      onChange={handleAuthorSelect}
      value={selectedAuthor}
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
