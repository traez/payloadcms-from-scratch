import { headers as getHeaders } from 'next/headers'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="flex flex-col justify-around items-center h-full px-6 py-6 max-w-4xl mx-auto overflow-hidden bg-white text-black">
      <div className="flex flex-col items-center justify-center flex-grow">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && (
          <h1 className="mt-2 mb-2 text-center text-6xl md:text-5xl sm:text-4xl font-bold leading-tight">
            Welcome to your new project.
          </h1>
        )}
        {user && (
          <h1 className="mt-2 mb-2 text-center text-6xl md:text-5xl sm:text-4xl font-bold leading-tight">
            Welcome back, {user.email}
          </h1>
        )}
        <div className="flex items-center gap-3">
          <a
            className="text-white bg-black border border-black rounded px-2 py-1 no-underline hover:opacity-80 active:opacity-70"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="text-black bg-white border border-black rounded px-2 py-1 no-underline hover:opacity-80 active:opacity-70"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-col md:flex-row">
        <p className="m-0">Update this page by editing</p>
        <a className="bg-neutral-200 rounded px-2 py-0.5 no-underline" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
