// src/components/RichTextRenderer/index.tsx
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { jsxConverters } from '@/components/blog/jsxConverters'

interface RichTextRendererProps {
  data: SerializedEditorState
  className?: string
}

export default function RichTextRenderer({ data, className }: RichTextRendererProps) {
  return (
    <div className={className}>
      <RichText data={data} converters={jsxConverters} />
    </div>
  )
}
