// src/app/(frontend)/(pages)/blog/page.tsx
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@/payload.config'
import PostsList from '@/components/blog/PostsList'

export default async function Blogpage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  console.log(user)

  const res = await payload.find({
    collection: 'posts',
    limit: 10,
    page: 1,
    sort: '-publishedAt',
    where: { published: { equals: true } },
  })

  return <PostsList initialPosts={res.docs} initialPage={res.page!} totalPages={res.totalPages!} />
}
