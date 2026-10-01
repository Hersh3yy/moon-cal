import type { H3Event } from 'h3'
import { getHygraphPost, listHygraphPosts } from './hygraph'
import { getVamsPost, listVamsPosts } from './vams'
import type { Post, PostSummary } from './shared'

/** One switch (NUXT_POSTS_SOURCE) chooses the CMS. The pages never know which one it is. */
function source(event: H3Event): 'hygraph' | 'vams' {
  return useRuntimeConfig(event).postsSource === 'vams' ? 'vams' : 'hygraph'
}

export function listPosts(event: H3Event): Promise<PostSummary[]> {
  return source(event) === 'vams' ? listVamsPosts(event) : listHygraphPosts(event)
}

export function getPost(event: H3Event, slug: string): Promise<Post | null> {
  return source(event) === 'vams' ? getVamsPost(event, slug) : getHygraphPost(event, slug)
}
