import { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'

type HeroProps = Extract<Page['layout'][0], { blockType: 'hero' }>

export default function HeroBC({ block }: { block: HeroProps }) {
  return (
    <div className="flex flex-col items-center border border-red-500 p-5">
      <h1 className="text-4xl font-bold">{block.heading}</h1>
      <div className="my-4">
        <RichText data={block.subheading} />
      </div>
      {typeof block?.image === 'object' && block.image.url && (
        <div className="my-4">
          <Image
            src={block.image.url}
            alt={block.image.alt}
            width={400}
            height={300}
            priority
            className="rounded"
          />
        </div>
      )}
      <Link
        href={block.cta_button.url}
        className="mt-5 inline-block rounded bg-blue-600 px-5 py-2 text-white no-underline hover:bg-blue-700 transition"
      >
        {block.cta_button.label}
      </Link>
    </div>
  )
}
