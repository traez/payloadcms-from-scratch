//src\components\blog\date\DateSelect.tsx
'use client'
import { useRouter, usePathname } from 'next/navigation'

interface DateSelectProps {
  dates: { key: string; label: string; count: number }[]
}

export default function DateSelect({ dates }: DateSelectProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine default selected value from URL (e.g., /blog/date/2025-oct)
  const defaultValue =
    pathname?.startsWith('/blog/date') && pathname.split('/blog/date/')[1]
      ? decodeURIComponent(pathname.split('/blog/date/')[1])
      : ''

  const handleDateSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDate = event.target.value
    if (selectedDate) {
      router.push(`/blog/date/${encodeURIComponent(selectedDate)}`)
    }
  }

  return (
    <select
      className="border rounded px-3 py-2 w-full"
      onChange={handleDateSelect}
      value={defaultValue}
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
