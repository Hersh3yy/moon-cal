import type { Post, PostSummary } from '~/types/post'

export function usePostList() {
  return useAsyncData<PostSummary[]>('posts', () => $fetch<PostSummary[]>('/api/posts'), { default: () => [] })
}

export function usePost(slug: MaybeRefOrGetter<string>) {
  const key = computed(() => `post:${toValue(slug)}`)
  return useAsyncData<Post | null>(key.value, () => $fetch<Post>(`/api/posts/${encodeURIComponent(toValue(slug))}`), { watch: [key] })
}
