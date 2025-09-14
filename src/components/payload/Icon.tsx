import Image from 'next/image'

export default function Icon() {
  return (
    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
      <Image
        src="/mark_cobalt.svg"
        alt="Site Logo"
        width={40}
        height={40}
        style={{
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  )
}
