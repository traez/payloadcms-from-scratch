//src\components\blog\BlogSidebar.tsx
import BlogSidebarTag from '@/components/blog/tag/BlogSidebarTag'
import BlogSidebarAuthor from '@/components/blog/author/BlogSidebarAuthor'
import BlogSidebarDate from '@/components/blog/date/BlogSidebarDate'

export default function BlogSidebar() {
  return (
    <section className="flex flex-col gap-4 mb-6 lg:mb-0 lg:w-1/4">
      {/* Tags */}
      <BlogSidebarTag />

      {/* Author */}
      <BlogSidebarAuthor />

      {/* Date */}
      <BlogSidebarDate />
    </section>
  )
}
