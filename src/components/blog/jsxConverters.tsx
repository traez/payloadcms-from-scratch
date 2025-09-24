import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  SerializedUploadNode,
  SerializedHeadingNode,
  SerializedListNode,
  SerializedQuoteNode,
  SerializedParagraphNode,
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

// Helper function to extract text from lexical children
function extractTextFromChildren(children: unknown): string {
  if (!Array.isArray(children)) return ''

  return children
    .map((child: unknown) => {
      if (typeof child === 'object' && child !== null && 'text' in child) {
        return (child as LexicalTextNode).text || ''
      }
      return ''
    })
    .join('')
}

// Helper function to render lexical children
function renderLexicalChildren(children: unknown): React.ReactNode[] {
  if (!Array.isArray(children)) return []

  return children.map((child: unknown, index: number) => {
    if (typeof child === 'object' && child !== null && 'text' in child) {
      const textChild = child as LexicalTextNode
      return textChild.text || React.createElement('span', { key: index })
    }
    return React.createElement('span', { key: index })
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

// Custom upload converter using Next.js Image - Fixed sizing
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

// Image Block Component - Fixed to use actual dimensions and center
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
  // Handle various YouTube URL formats including Shorts
  const patterns = [
    // Standard watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Short URLs: https://youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URLs: https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Shorts URLs: https://www.youtube.com/shorts/VIDEO_ID
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

// Video Block Component - Fixed for YouTube Shorts and other formats
const VideoBlockComponent: React.FC<{ node: SerializedBlockNode<VideoBlockType> }> = ({ node }) => {
  const { url } = node.fields

  if (!url) {
    return null
  }

  // Extract YouTube video ID
  const youtubeId = getYouTubeVideoId(url)

  if (youtubeId) {
    // Create YouTube embed URL
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

  // Handle other video platforms or direct video URLs
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

  // For other platforms (Vimeo, etc.) - you can extend this
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

// Main converter function
export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Link converter with internal link support
  ...LinkJSXConverter({ internalDocToHref }),
  // Custom heading converter
  ...headingConverter,
  // Override upload converter - Fixed sizing
  upload: ({ node }) => <CustomUploadComponent node={node} />,
  // Custom blocks - Use correct block slugs with fixed sizing
  blocks: {
    image: ({ node }) => <ImageBlockComponent node={node} />,
    video: ({ node }) => <VideoBlockComponent node={node} />,
  },
  // Add custom styling to other elements
  paragraph: ({ node }: { node: SerializedParagraphNode }) => (
    <p className="mb-4 leading-relaxed text-gray-800">{renderLexicalChildren(node.children)}</p>
  ),
  list: ({ node }: { node: SerializedListNode }) => {
    const tag = node.tag as 'ul' | 'ol'
    const className =
      node.tag === 'ul'
        ? 'list-disc list-inside mb-4 ml-4 space-y-1'
        : 'list-decimal list-inside mb-4 ml-4 space-y-1'

    const children = Array.isArray(node.children)
      ? node.children.map((child: unknown, index: number) => {
          const textContent =
            typeof child === 'object' && child !== null && 'text' in child
              ? (child as LexicalTextNode).text
              : ''
          return React.createElement('li', { key: index, className: 'text-gray-800' }, textContent)
        })
      : []

    return React.createElement(tag, { className }, children)
  },
  quote: ({ node }: { node: SerializedQuoteNode }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-700 bg-gray-50 rounded-r">
      {renderLexicalChildren(node.children)}
    </blockquote>
  ),
})
