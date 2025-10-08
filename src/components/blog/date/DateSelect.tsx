// src/components/blog/date/DateSelect.tsx
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'

interface DateSelectProps {
  dates: { key: string; label: string; count: number }[]
}

export default function DateSelect({ dates }: DateSelectProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Get date key from current route
  const currentDate = pathname?.startsWith('/blog/date/')
    ? decodeURIComponent(pathname.split('/blog/date/')[1])
    : ''

  // Track local selection for instant UI updates
  const [selectedDate, setSelectedDate] = useState(currentDate)

  // Sync with route if user navigates by other means
  useEffect(() => {
    setSelectedDate(currentDate)
  }, [currentDate])

  const handleDateSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = event.target.value
    setSelectedDate(newDate) // instant feedback
    if (newDate) {
      router.push(`/blog/date/${encodeURIComponent(newDate)}`)
    }
  }

  return (
    <select
      className="border rounded px-3 py-2 w-full"
      onChange={handleDateSelect}
      value={selectedDate}
    >
      <option value="">Select Date</option>
      {dates.map(({ key, label, count }) => (
        <option key={key} value={key}>
          {label} ({count})
        </option>
      ))}
    </select>
  )
}
