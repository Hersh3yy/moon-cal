import { getPost } from '../../utils/posts'

/** GET /api/posts/:slug → one full post (rendered HTML included) or 404. Cached 10 minutes per slug. */
export default defineCachedEventHandler(
  async (event) => {
    const slug = String(getRouterParam(event, 'slug') ?? '').trim()
    if (!/^[a-z0-9-]{1,120}$/i.test(slug)) throw createError({ statusCode: 400, statusMessage: 'Invalid post slug.' })
    const post = await getPost(event, slug)
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found.' })
    return post
  },
  { name: 'post', maxAge: 60 * 10, swr: true, shouldBypassCache: () => Boolean(import.meta.prerender), getKey: (event) => String(getRouterParam(event, 'slug') ?? '') },
)
