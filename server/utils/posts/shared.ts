import type { Post, PostSummary } from '~/types/post'

export type { Post, PostSummary }

const WORDS_PER_MINUTE = 220

export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

export function countWords(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0
}

export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
}

export function cleanTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  return [...new Set(tags.map((t) => String(t ?? '').trim()).filter(Boolean))]
}

export function toSummary(post: Post): PostSummary {
  const { html: _html, images: _images, references: _references, wordCount: _wc, ...summary } = post
  return summary
}

export function byDateDesc(a: PostSummary, b: PostSummary): number {
  return b.date.localeCompare(a.date)
}

const HYGRAPH_ASSET = /^(https:\/\/[a-z0-9-]+\.graphassets\.com\/[A-Za-z0-9]+\/)([A-Za-z0-9]+)$/

/**
 * Hygraph assets accept Filestack-style transformations in the URL. Turn a raw asset URL into a
 * resized WebP plus a srcset, so a 486 KB PNG becomes a 19 KB WebP at 800 px.
 */
export function responsiveImage(url: string, widths: number[] = [480, 800, 1200]): { src: string; srcset?: string } {
  const m = url.match(HYGRAPH_ASSET)
  if (!m) return { src: url }
  const [, base, handle] = m
  const variant = (w: number) => `${base}resize=width:${w}/output=format:webp/${handle}`
  return {
    src: variant(widths[widths.length - 1]),
    srcset: widths.map((w) => `${variant(w)} ${w}w`).join(', '),
  }
}
