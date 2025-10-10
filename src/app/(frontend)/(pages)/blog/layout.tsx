// src/app/(frontend)/(pages)/blog/layout.tsx
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import BlogSidebar from '@/components/blog/BlogSidebar'

export const metadata: Metadata = {
  description: 'Created by Trae Zeeofor',
  title: 'Blog - PayloadCMS From Scratch',
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <section className="w-full mx-auto px-6 py-10 flex flex-col lg:flex-row-reverse lg:gap-8">
      {/* sidebar */}
      <BlogSidebar />

      {/* Main blog content */}
      <div className="lg:w-3/4">{children}</div>
    </section>
  )
}
