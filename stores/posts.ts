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
    // Ensure data is serializable
    posts.value = newPosts.map(post => ({
      ...post,
      content: post.content ? {
        json: JSON.parse(JSON.stringify(post.content.json))
      } : undefined
    }))
  }
  
  function getPost(slug: string) {
    const post = posts.value.find(post => post.slug === slug)
    if (!post) return undefined
    
    // Return a serializable copy
    return {
      ...post,
      content: post.content ? {
        json: JSON.parse(JSON.stringify(post.content.json))
      } : undefined
    }
  }
  
  function updatePost(post: Post) {
    // Ensure data is serializable
    const serializedPost = {
      ...post,
      content: post.content ? {
        json: JSON.parse(JSON.stringify(post.content.json))
      } : undefined
    }

    const index = posts.value.findIndex(p => p.slug === post.slug)
    if (index !== -1) {
      posts.value[index] = serializedPost
    } else {
      posts.value.push(serializedPost)
    }
  }

  return {
    posts,
    setPosts,
    getPost,
    updatePost
  }
}) 