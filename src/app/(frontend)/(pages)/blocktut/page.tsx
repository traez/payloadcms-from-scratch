import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { Page } from '@/payload-types'
import HeroBlock from '@/components/payload/HeroBlock'
import ContentBlock from '@/components/payload/ContentBlock'
import NewsletterBlock from '@/components/payload/NewsletterBlock'

const renderBlock = (block: Page['layout'][0]) => {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock block={block} key={block.id} />
    case 'content':
      return <ContentBlock block={block} key={block.id} />
    case 'newsletter-form':
      return <NewsletterBlock block={block} key={block.id} />
    default:
      return null
  }
}

export default async function Blocktutpage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'landing-page' },
    },
  })

  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <section>
      <div>{page.layout?.map((block) => renderBlock(block))}</div>
    </section>
  )
}
