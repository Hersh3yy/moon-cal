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
  }
  referenceUrls?: string[]
  locale?: string
}

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    lastFetched: null as Date | null
  }),
  
  actions: {
    setPosts(posts: Post[]) {
      this.posts = posts
      this.lastFetched = new Date()
    },
    
    updatePost(newPost: Post) {
      const index = this.posts.findIndex(post => post.slug === newPost.slug)
      if (index !== -1) {
        // Create a new array to avoid direct mutation
        this.posts = [
          ...this.posts.slice(0, index),
          newPost,
          ...this.posts.slice(index + 1),
        ]
      } else {
        // If the post doesn't exist, you might want to add it
        this.posts.push(newPost)
      }
    },
    
    getPost(slug: string) {
      return this.posts.find(p => p.slug === slug) || null
    },
    
    clearCache() {
      this.lastFetched = null
    }
  },
  
  getters: {
    isCacheValid: (state) => {
      if (!state.lastFetched) return false
      // Cache valid for 5 minutes
      const cacheTime = 5 * 60 * 1000
      return (new Date().getTime() - state.lastFetched.getTime()) < cacheTime
    }
  }
}) 