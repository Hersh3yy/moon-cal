import { listPosts } from '../../utils/posts'

/** Sitemap source: the fixed pages plus every published blog post. */
export default defineSitemapEventHandler(async (event) => {
  const posts = await listPosts(event).catch(() => [])
  return [
    { loc: '/', changefreq: 'daily' as const, priority: 1 },
    { loc: '/blog', changefreq: 'weekly' as const, priority: 0.8 },
    ...posts.map((post) => ({
      loc: `/blog/${post.slug}`,
      lastmod: post.updatedAt ?? post.date,
      changefreq: 'monthly' as const,
      priority: 0.7 as const,
    })),
  ]
})
