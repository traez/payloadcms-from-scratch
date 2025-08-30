import { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type ContentProps = Extract<Page['layout'][0], { blockType: 'content' }>

export default function ContentBlock({ block }: { block: ContentProps }) {
  return (
    <section className="my-8 px-4 md:px-8 lg:px-16 border border-red-500 p-5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">{block.heading}</h2>
        <div className="prose prose-slate">
          <RichText data={block.content} />
        </div>
      </div>
    </section>
  )
}
