// src/app/(frontend)/(pages)/blog/page.tsx
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@/payload.config'

export default async function Blogpage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  console.log(user);

  // Fetch 10 most recent published posts
  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 10,
    sort: '-publishedAt',
    where: {
      published: { equals: true },
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">Latest Posts</h1>

      {posts.length === 0 && <p className="text-gray-600">No posts available.</p>}

      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            {post.excerpt && <p className="text-gray-700 mb-3">{post.excerpt}</p>}
            <p className="text-sm text-gray-500">
              Published:{' '}
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unpublished'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
