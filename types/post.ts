// The blog post shape the site renders. Every CMS adapter (Hygraph today, VAMS next) maps to this.

export interface PostImage {
  url: string
  /** Responsive candidates (Hygraph transformations) when available. */
  srcset?: string
  alt?: string
  width?: number
  height?: number
}

export interface PostSummary {
  slug: string
  title: string
  excerpt: string
  date: string // YYYY-MM-DD
  updatedAt?: string // ISO
  tags: string[]
  author?: string
  coverImage?: PostImage
  readingMinutes: number
}

export interface Post extends PostSummary {
  html: string
  images: PostImage[]
  references: string[]
  wordCount: number
}
