interface SeoOptions {
  title: string
  description: string
  /** Absolute URL, or a site-relative path starting with "/". */
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

/** Per-page SEO: title, description, canonical, Open Graph and Twitter cards, all absolute. */
export function useSeo(options: SeoOptions) {
  const route = useRoute()
  const { siteUrl, siteName } = useRuntimeConfig().public
  const absolute = (path?: string) => (!path ? `${siteUrl}/og-default.jpg` : path.startsWith('http') ? path : `${siteUrl}${path}`)
  const canonical = `${siteUrl}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`
  const image = absolute(options.image)

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogImage: image,
    ogUrl: canonical,
    ogType: options.type ?? 'website',
    ogSiteName: siteName,
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
    articlePublishedTime: options.publishedTime,
    articleModifiedTime: options.modifiedTime,
    articleAuthor: options.author ? [options.author] : undefined,
  })
}
