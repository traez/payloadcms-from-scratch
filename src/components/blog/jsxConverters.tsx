import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  SerializedUploadNode,
  SerializedHeadingNode,
  SerializedListNode,
  SerializedQuoteNode,
  SerializedParagraphNode,
  SerializedListItemNode,
} from '@payloadcms/richtext-lexical'
import { type JSXConvertersFunction, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

// Define lexical text node interface
interface LexicalTextNode {
  text: string
  type: 'text'
  format?: number
  style?: string
  mode?: string
  detail?: number
}

// Define lexical linebreak node
interface LexicalLineBreakNode {
  type: 'linebreak'
  version: number
}

// Define lexical link node (inline)
interface LexicalLinkNode {
  type: 'link'
  children: LexicalNode[]
  fields?: {
    url?: string
    newTab?: boolean
    doc?: {
      relationTo: string
      value: number | Record<string, unknown>
    }
  }
  version: number
}

// Union type for all possible child nodes
type LexicalNode =
  | LexicalTextNode
  | LexicalLineBreakNode
  | LexicalLinkNode
  | LexicalNodeWithChildren

// Generic node with children
interface LexicalNodeWithChildren {
  type: string
  children?: LexicalNode[]
  version: number
  [key: string]: unknown
}

// Define your block types based on your Payload config
type ImageBlockType = {
  blockName?: string
  blockType: 'image'
  image?: number | Media
  caption?: string
}

type VideoBlockType = {
  blockName?: string
  blockType: 'video'
  url?: string
}

// Media interface for typed uploads
interface MediaWithDimensions extends Media {
  url: string
  width: number
  height: number
  filename: string
  alt: string
}

// Extend node types to include your custom blocks
type NodeTypes = DefaultNodeTypes | SerializedBlockNode<ImageBlockType | VideoBlockType>

// Lexical text format constants (bitmask values)
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

// Type guard for Media with required properties
function isMediaWithDimensions(media: unknown): media is MediaWithDimensions {
  return (
    typeof media === 'object' &&
    media !== null &&
    'url' in media &&
    'width' in media &&
    'height' in media &&
    'filename' in media &&
    typeof (media as MediaWithDimensions).url === 'string' &&
    typeof (media as MediaWithDimensions).width === 'number' &&
    typeof (media as MediaWithDimensions).height === 'number' &&
    typeof (media as MediaWithDimensions).filename === 'string'
  )
}

// Type guard for text node
function isTextNode(node: unknown): node is LexicalTextNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    'text' in node &&
    'type' in node &&
    (node as LexicalTextNode).type === 'text'
  )
}

// Type guard for link node
function isLinkNode(node: unknown): node is LexicalLinkNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as LexicalLinkNode).type === 'link'
  )
}

// Type guard for linebreak node
function isLineBreakNode(node: unknown): node is LexicalLineBreakNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as LexicalLineBreakNode).type === 'linebreak'
  )
}

// Type guard for node with children
function hasChildren(node: unknown): node is LexicalNodeWithChildren {
  return (
    typeof node === 'object' &&
    node !== null &&
    'children' in node &&
    Array.isArray((node as LexicalNodeWithChildren).children)
  )
}

// Helper function to extract text from lexical children (for IDs, etc.)
function extractTextFromChildren(children: unknown): string {
  if (!Array.isArray(children)) return ''

  return children
    .map((child: unknown) => {
      if (isTextNode(child)) {
        return child.text || ''
      }
      // Recursively extract text from nested children
      if (hasChildren(child)) {
        return extractTextFromChildren(child.children)
      }
      return ''
    })
    .join('')
}

// Helper function to render lexical children with formatting
function renderLexicalChildren(children: unknown): React.ReactNode[] {
  if (!Array.isArray(children)) return []

  return children.map((child: unknown, index: number) => {
    // Handle text nodes with formatting
    if (isTextNode(child)) {
      let text: React.ReactNode = child.text || ''
      const format = child.format || 0

      // Apply formatting based on bitmask
      if (format & IS_BOLD) {
        text = <b>{text}</b>
      }
      if (format & IS_ITALIC) {
        text = <em>{text}</em>
      }
      if (format & IS_STRIKETHROUGH) {
        text = <s>{text}</s>
      }
      if (format & IS_UNDERLINE) {
        text = <u>{text}</u>
      }
      if (format & IS_CODE) {
        text = (
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">
            {text}
          </code>
        )
      }
      if (format & IS_SUBSCRIPT) {
        text = <sub>{text}</sub>
      }
      if (format & IS_SUPERSCRIPT) {
        text = <sup>{text}</sup>
      }

      return <React.Fragment key={index}>{text}</React.Fragment>
    }

    // Handle link nodes (inline)
    if (isLinkNode(child)) {
      return (
        <a
          key={index}
          href={child.fields?.url || '#'}
          target={child.fields?.newTab ? '_blank' : undefined}
          rel={child.fields?.newTab ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {renderLexicalChildren(child.children)}
        </a>
      )
    }

    // Handle linebreak nodes
    if (isLineBreakNode(child)) {
      return <br key={index} />
    }

    // Handle nested children (for complex structures)
    if (hasChildren(child)) {
      return <React.Fragment key={index}>{renderLexicalChildren(child.children)}</React.Fragment>
    }

    return <React.Fragment key={index} />
  })
}

// Internal link converter
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!

  if (typeof value !== 'object' || !value) {
    return '#'
  }

  const slug = (value as { slug?: string }).slug

  switch (relationTo) {
    case 'posts':
      return `/blog/${slug || ''}`
    case 'pages':
      return `/${slug || ''}`
    default:
      return `/${relationTo}/${slug || ''}`
  }
}

// Custom upload converter using Next.js Image
const CustomUploadComponent: React.FC<{ node: SerializedUploadNode }> = ({ node }) => {
  const uploadDoc = node.value

  if (!isMediaWithDimensions(uploadDoc)) {
    return null
  }

  const { alt, height, url, width, filename } = uploadDoc

  return (
    <div className="my-6 flex justify-center">
      <Image
        alt={alt || filename || 'Upload'}
        src={url}
        width={width}
        height={height}
        className="rounded-lg shadow-lg"
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '100%',
        }}
      />
    </div>
  )
}

// Image Block Component
const ImageBlockComponent: React.FC<{ node: SerializedBlockNode<ImageBlockType> }> = ({ node }) => {
  const { image, caption } = node.fields

  if (!isMediaWithDimensions(image)) {
    return null
  }

  const { url, width, height, filename, alt } = image

  return (
    <figure className="my-8 flex flex-col items-center">
      <Image
        alt={alt || caption || filename || 'Image block'}
        src={url}
        width={width}
        height={height}
        className="rounded-lg shadow-lg"
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '100%',
        }}
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center italic max-w-lg">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Improved YouTube URL extraction function
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

// Video Block Component
const VideoBlockComponent: React.FC<{ node: SerializedBlockNode<VideoBlockType> }> = ({ node }) => {
  const { url } = node.fields

  if (!url) {
    return null
  }

  // Extract YouTube video ID
  const youtubeId = getYouTubeVideoId(url)

  if (youtubeId) {
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`

    return (
      <figure className="my-8">
        <div className="relative w-full rounded-lg overflow-hidden shadow-lg aspect-video bg-gray-100">
          <iframe
            src={embedUrl}
            title="YouTube Video"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </figure>
    )
  }

  // Handle direct video URLs
  const isDirectVideo = url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)

  if (isDirectVideo) {
    return (
      <figure className="my-8">
        <div className="relative w-full rounded-lg overflow-hidden shadow-lg aspect-video bg-gray-100">
          <video controls className="w-full h-full object-contain" preload="metadata">
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      </figure>
    )
  }

  // Handle Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1]
    return (
      <figure className="my-8">
        <div className="relative w-full rounded-lg overflow-hidden shadow-lg aspect-video bg-gray-100">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Vimeo Video"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </figure>
    )
  }

  // Fallback for unrecognized URLs
  return (
    <figure className="my-8">
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-600 mb-2">Video URL:</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {url}
        </a>
      </div>
    </figure>
  )
}

// Heading converter with anchor IDs
const headingConverter = {
  heading: ({ node }: { node: SerializedHeadingNode }) => {
    const tag = node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

    // Generate ID from heading text for anchor links
    const textContent = extractTextFromChildren(node.children)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const id = textContent || undefined

    const classNames: Record<string, string> = {
      h1: 'text-4xl font-bold mt-8 mb-4 text-gray-900',
      h2: 'text-3xl font-semibold mt-6 mb-3 text-gray-900',
      h3: 'text-2xl font-semibold mt-5 mb-2 text-gray-900',
      h4: 'text-xl font-medium mt-4 mb-2 text-gray-900',
      h5: 'text-lg font-medium mt-3 mb-2 text-gray-900',
      h6: 'text-base font-medium mt-2 mb-1 text-gray-900',
    }

    const className = classNames[tag] || classNames.h1

    const props = {
      id,
      className,
    }

    const children = renderLexicalChildren(node.children)

    return React.createElement(tag, props, children)
  },
}

// Define code node interface
interface SerializedCodeNode {
  type: 'code'
  children: LexicalNode[]
  version: number
}

// Main converter function
export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Link converter with internal link support
  ...LinkJSXConverter({ internalDocToHref }),
  // Custom heading converter
  ...headingConverter,
  // Override upload converter
  upload: ({ node }) => <CustomUploadComponent node={node} />,
  // Custom blocks
  blocks: {
    image: ({ node }) => <ImageBlockComponent node={node} />,
    video: ({ node }) => <VideoBlockComponent node={node} />,
  },
  // Paragraph styling
  paragraph: ({ node }: { node: SerializedParagraphNode }) => (
    <p className="mb-4 leading-relaxed text-gray-800">{renderLexicalChildren(node.children)}</p>
  ),
  // Improved list rendering - properly handles formatted text in list items
  list: ({ node }: { node: SerializedListNode }) => {
    const tag = node.tag as 'ul' | 'ol'
    const className =
      node.tag === 'ul'
        ? 'list-disc list-inside mb-4 ml-4 space-y-1'
        : 'list-decimal list-inside mb-4 ml-4 space-y-1'

    const children = Array.isArray(node.children)
      ? node.children.map((child, index: number) => {
          // Type assertion since we know list children should be list items
          const listItem = child as SerializedListItemNode

          // Each child should be a listitem node with its own children
          if (listItem.type === 'listitem' && listItem.children) {
            return React.createElement(
              'li',
              { key: index, className: 'text-gray-800' },
              renderLexicalChildren(listItem.children),
            )
          }
          // Fallback for unexpected structure
          return React.createElement('li', { key: index, className: 'text-gray-800' }, '')
        })
      : []

    return React.createElement(tag, { className }, children)
  },
  // Quote styling
  quote: ({ node }: { node: SerializedQuoteNode }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-700 bg-gray-50 rounded-r">
      {renderLexicalChildren(node.children)}
    </blockquote>
  ),
  // Line break support
  linebreak: () => <br />,
  // Code block support (if you use code blocks in your editor)
  code: ({ node }: { node: SerializedCodeNode }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">
      <code>{extractTextFromChildren(node.children)}</code>
    </pre>
  ),
})
