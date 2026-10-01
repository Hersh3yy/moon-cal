import type { H3Event } from 'h3'
import { marked } from 'marked'
import { byDateDesc, cleanTags, countWords, readingMinutes, stripTags, toSummary } from './shared'
import type { Post, PostSummary } from './shared'

/**
 * VAMS adapter. Reads entries of one entry type over the read-only API-key API
 * (GET /api/entries/by-type/{slug}) and maps them to the site's Post shape.
 *
 * Expected entry type `moon-post` (field_config), the entry title being the post title:
 *   slug (text, required) · excerpt (textarea) · body (textarea, Markdown) · tags (text, comma-separated)
 *   author (text) · cover (image_collection, max 1, with alt) · gallery (image_collection)
 *   reference_urls (textarea, one URL per line) — and `published_at` for the date.
 */
interface VamsImage { url?: string; path?: string; alt?: string; width?: number; height?: number }
interface VamsEntry {
  id: string
  title: string
  content: Record<string, unknown>
  status: string
  published_at?: string | null
  updated_at?: string | null
  order?: number
}

async function fetchEntries(event: H3Event): Promise<VamsEntry[]> {
  const { vamsUrl, vamsApiKey, vamsPostType } = useRuntimeConfig(event)
  if (!vamsApiKey) throw createError({ statusCode: 503, statusMessage: 'VAMS blog source is not configured.' })
  const res = await $fetch<{ data?: { entries?: VamsEntry[] }; entries?: VamsEntry[] }>(`${vamsUrl}/api/entries/by-type/${vamsPostType}`, {
    headers: { 'X-API-Key': vamsApiKey, Accept: 'application/json' },
    timeout: 15_000,
  })
  return res.data?.entries ?? res.entries ?? []
}

function str(v: unknown): string { return typeof v === 'string' ? v : '' }
function imageOf(v: unknown): VamsImage | undefined {
  const first = Array.isArray(v) ? v[0] : v
  return first && typeof first === 'object' ? (first as VamsImage) : undefined
}
function imageUrl(img: VamsImage | undefined): string | undefined {
  if (!img) return undefined
  return img.url || (img.path ? img.path : undefined)
}

async function toPost(entry: VamsEntry): Promise<Post> {
  const c = entry.content ?? {}
  const html = await marked.parse(str(c.body), { async: true, gfm: true })
  const wordCount = countWords(stripTags(html))
  const cover = imageOf(c.cover)
  const coverUrl = imageUrl(cover)
  const gallery = Array.isArray(c.gallery) ? (c.gallery as VamsImage[]) : []
  return {
    slug: str(c.slug) || entry.id,
    title: entry.title,
    excerpt: str(c.excerpt).trim() || stripTags(html).slice(0, 160),
    date: (entry.published_at ?? '').slice(0, 10),
    updatedAt: entry.updated_at ?? undefined,
    tags: cleanTags(str(c.tags).split(',')),
    author: str(c.author) || undefined,
    coverImage: coverUrl ? { url: coverUrl, alt: cover?.alt || entry.title, width: cover?.width, height: cover?.height } : undefined,
    images: gallery.map((g) => ({ url: imageUrl(g) ?? '', alt: g.alt || entry.title, width: g.width, height: g.height })).filter((g) => g.url),
    references: str(c.reference_urls).split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
    html,
    wordCount,
    readingMinutes: readingMinutes(wordCount),
  }
}

export async function listVamsPosts(event: H3Event): Promise<PostSummary[]> {
  const entries = await fetchEntries(event)
  const posts = await Promise.all(entries.map(toPost))
  return posts.map(toSummary).sort(byDateDesc)
}

export async function getVamsPost(event: H3Event, slug: string): Promise<Post | null> {
  const entries = await fetchEntries(event)
  const entry = entries.find((e) => str(e.content?.slug) === slug || e.id === slug)
  return entry ? toPost(entry) : null
}
