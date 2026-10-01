import { listPosts } from '../../utils/posts'

/** GET /api/posts → published post summaries, newest first. Cached 10 minutes. */
export default defineCachedEventHandler((event) => listPosts(event), { name: 'posts', maxAge: 60 * 10, swr: true, shouldBypassCache: () => Boolean(import.meta.prerender) })
