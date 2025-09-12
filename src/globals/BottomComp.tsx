import Image from 'next/image'

type BottomData = {
  text: string
  logo?: {
    url: string
    alt?: string
  }
}

export default async function BottomComp() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/bottom`,
    { cache: 'no-store' }, // ensures fresh data on every request
  )

  if (!res.ok) {
    console.error('Failed to fetch Bottom global')
    return <div className="py-4 text-center text-red-500">Error loading footer content</div>
  }

  const data: BottomData = await res.json()

  return (
    <div className="w-full border-t border-gray-200 py-6 text-center">
      {data.logo?.url && (
        <div className="mx-auto mb-2 h-10 w-auto relative">
          <Image
            src={data.logo.url}
            alt={data.logo.alt || 'Bottom logo'}
            width={120} // adjust to your needs
            height={40} // adjust to your needs
            className="mx-auto h-10 w-auto object-contain"
          />
        </div>
      )}
      <p className="text-gray-700">{data.text}</p>
    </div>
  )
}
