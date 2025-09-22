// src/app/(frontend)/(pages)/blog/layout.tsx
import { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'Created by Trae Zeeofor',
  title: 'Blog - Payload From Scratch',
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <section className="w-full mx-auto px-6 py-10 flex flex-col lg:flex-row-reverse lg:gap-8">
      {/* Dropdowns (sidebar) */}
      <aside className="flex flex-col gap-4 mb-6 lg:mb-0 lg:w-1/4">
        {/* Tags */}
        <select className="border rounded px-3 py-2">
          <option value="">Select Tag</option>
          <option value="tech">Tech</option>
          <option value="life">Life</option>
        </select>

        {/* Author */}
        <select className="border rounded px-3 py-2">
          <option value="">Select Author</option>
          <option value="john">John Doe</option>
          <option value="jane">Jane Smith</option>
        </select>

        {/* Date */}
        <select className="border rounded px-3 py-2">
          <option value="">Select Date</option>
          <option value="2025-09">Sep 2025</option>
          <option value="2025-10">Oct 2025</option>
        </select>
      </aside>

      {/* Main content (each blog sub-route renders here) */}
      <div className="lg:w-3/4">{children}</div>
    </section>
  )
}
