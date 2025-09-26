// src/app/(frontend)/(pages)/blog/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import PostsList from '@/components/blog/PostsList'

export default async function Blogpage() {
  const payload = await getPayload({ config })

  const res = await payload.find({
    collection: 'posts',
    limit: 10,
    page: 1,
    sort: '-publishedAt',
    where: { published: { equals: true } },
  })

  return <PostsList initialPosts={res.docs} initialPage={res.page!} totalPages={res.totalPages!} />
}

/* Code in this page preloads first page server-side for faster initial render and better SEO. With Client-side pagination still works in PostsList for subsequent pages. */
