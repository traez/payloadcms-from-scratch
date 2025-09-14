import Image from 'next/image'

export default function Logo() {
  return (
    <div style={{ position: 'relative', width: '300px', height: '200px' }}>
      <Image
        src="/primary_cobalt.svg"
        alt="Site Logo"
        width={300}
        height={200}
        style={{
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  )
}
