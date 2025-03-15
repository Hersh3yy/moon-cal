import { defineStore } from 'pinia'

interface Post {
  title: string
  slug: string
  date: string
  excerpt?: string
  content?: {
    json: any
  }
  coverImage?: {
    url: string
  }
  author?: {
    name: string
    biography?: string
  }
  referenceUrls?: string[]
  locale?: string
  seoOverride?: {
    id: string
  }
}

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  
  function setPosts(newPosts: Post[]) {
    posts.value = newPosts
  }
  
  function getPost(slug: string) {
    return posts.value.find(post => post.slug === slug)
  }
  
  function updatePost(post: Post) {
    const index = posts.value.findIndex(p => p.slug === post.slug)
    if (index !== -1) {
      posts.value[index] = post
    } else {
      posts.value.push(post)
    }
  }

  return {
    posts,
    setPosts,
    getPost,
    updatePost
  }
}) 