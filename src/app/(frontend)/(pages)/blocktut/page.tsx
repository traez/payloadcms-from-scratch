import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { Page } from '@/payload-types'
import HeroBC from '@/components/payload/HeroBC'
import ContentBC from '@/components/payload/ContentBC'
import NewsletterFormBC from '@/components/payload/NewsletterFormBC'

const renderBlock = (block: Page['layout'][0]) => {
  switch (block.blockType) {
    case 'hero':
      return <HeroBC block={block} key={block.id} />
    case 'content':
      return <ContentBC block={block} key={block.id} />
    case 'newsletter-form':
      return <NewsletterFormBC block={block} key={block.id} />
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
