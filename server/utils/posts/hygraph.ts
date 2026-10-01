import type { H3Event } from 'h3'
import { astToHtmlString } from '@graphcms/rich-text-html-renderer'
import { byDateDesc, cleanTags, countWords, readingMinutes, responsiveImage, stripTags, toSummary } from './shared'
import type { Post, PostSummary } from './shared'

interface HygraphPost {
  title: string
  slug: string
  date: string
  updatedAt?: string
  excerpt?: string | null
  tags?: string[] | null
  referenceUrls?: string[] | null
  content?: { json?: { children?: unknown[] } | null } | null
  coverImage?: { url: string; width?: number; height?: number } | null
  author?: { name?: string | null } | null
  images?: { id: string; url: string; width?: number; height?: number }[] | null
}

const FIELDS = `
  title slug date updatedAt excerpt tags referenceUrls
  content { json }
  coverImage { url width height }
  author { name }
  images { id url width height }
`

async function query<T>(event: H3Event, gql: string, variables?: Record<string, unknown>): Promise<T> {
  const { hygraphEndpoint } = useRuntimeConfig(event)
  const res = await $fetch<{ data?: T; errors?: { message: string }[] }>(hygraphEndpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: { query: gql, variables },
    timeout: 15_000,
    retry: 3,
    retryDelay: 1500,
    retryStatusCodes: [429, 502, 503, 504],
  })
  if (res.errors?.length) throw createError({ statusCode: 502, statusMessage: `Blog source error: ${res.errors[0].message}` })
  return res.data as T
}

function toPost(raw: HygraphPost): Post {
  const html = raw.content?.json?.children
    ? astToHtmlString({
        content: raw.content.json as never,
        renderers: {
          img: ({ src, altText, width, height }: { src?: string; altText?: string; width?: number; height?: number }) => {
            if (!src) return ''
            const img = responsiveImage(src)
            const attrs = [
              `src="${img.src}"`,
              img.srcset ? `srcset="${img.srcset}" sizes="(min-width: 768px) 42rem, 100vw"` : '',
              `alt="${escapeAttr(altText ?? '')}"`,
              width ? `width="${width}"` : '',
              height ? `height="${height}"` : '',
              'loading="lazy"',
              'decoding="async"',
            ].filter(Boolean)
            return `<img ${attrs.join(' ')} />`
          },
        } as never,
      })
    : ''
  const wordCount = countWords(stripTags(html))
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt?.trim() || stripTags(html).slice(0, 160),
    date: (raw.date || '').slice(0, 10),
    updatedAt: raw.updatedAt ?? undefined,
    tags: cleanTags(raw.tags),
    author: raw.author?.name ?? undefined,
    coverImage: raw.coverImage ? { url: responsiveImage(raw.coverImage.url).src, srcset: responsiveImage(raw.coverImage.url).srcset, alt: raw.title, width: raw.coverImage.width, height: raw.coverImage.height } : undefined,
    images: (raw.images ?? []).map((i) => ({ url: responsiveImage(i.url).src, srcset: responsiveImage(i.url).srcset, alt: raw.title, width: i.width, height: i.height })),
    references: (raw.referenceUrls ?? []).filter(Boolean),
    html,
    wordCount,
    readingMinutes: readingMinutes(wordCount),
  }
}

// One fetch for all posts, shared by the list and the single-post lookups, so prerendering
// 30 pages costs one Hygraph call instead of 30 (the free tier rate-limits bursts with 429).
const ALL_POSTS_TTL = 10 * 60 * 1000
let allPostsCache: { at: number; posts: Post[]; pending?: Promise<Post[]> } = { at: 0, posts: [] }

async function allPosts(event: H3Event): Promise<Post[]> {
  const fresh = Date.now() - allPostsCache.at < ALL_POSTS_TTL && allPostsCache.posts.length > 0
  if (fresh) return allPostsCache.posts
  if (allPostsCache.pending) return allPostsCache.pending
  allPostsCache.pending = query<{ posts: HygraphPost[] }>(event, `{ posts(orderBy: date_DESC, first: 100) { ${FIELDS} } }`)
    .then((data) => {
      const posts = (data.posts ?? []).map(toPost)
      allPostsCache = { at: Date.now(), posts }
      return posts
    })
    .finally(() => {
      allPostsCache.pending = undefined
    })
  return allPostsCache.pending
}

export async function listHygraphPosts(event: H3Event): Promise<PostSummary[]> {
  return (await allPosts(event)).map(toSummary).sort(byDateDesc)
}

export async function getHygraphPost(event: H3Event, slug: string): Promise<Post | null> {
  const cached = (await allPosts(event)).find((p) => p.slug === slug)
  if (cached) return cached
  const data = await query<{ post: HygraphPost | null }>(event, `query ($slug: String!) { post(where: { slug: $slug }) { ${FIELDS} } }`, { slug })
  return data.post ? toPost(data.post) : null
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
