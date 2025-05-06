<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Moon Blog</h1>

    <div v-if="error" class="text-red-500 mb-6 p-4 bg-red-50 rounded-lg">
      <p>Error loading posts: {{ error.message || 'An error occurred while fetching data' }}</p>
    </div>

    <div v-else-if="pending" class="text-center py-8">
      <p class="text-lg text-gray-600">Loading blog posts...</p>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-8">
      <p class="text-lg text-gray-600">No blog posts available at the moment.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in posts" :key="post.slug" class="bg-white rounded-lg shadow-md overflow-hidden">
        <img v-if="post.coverImage?.url" :src="post.coverImage.url" :alt="post.title"
          class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">{{ post.title }}</h2>
          
          <!-- Display tags if available -->
          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
            <span v-for="tag in post.tags" :key="tag" 
              class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {{ tag }}
            </span>
          </div>
          
          <p class="text-gray-600 mb-4">{{ post.excerpt || 'Read more...' }}</p>
          
          <div class="flex justify-between items-center">
            <NuxtLink :to="'/blog/' + post.slug" class="text-blue-500 hover:text-blue-600">
              Read more →
            </NuxtLink>
            <span v-if="post.date" class="text-sm text-gray-500">
              {{ formatDate(post.date) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { gql } from 'graphql-tag'

// Define page meta for improved SSR handling
definePageMeta({
  ssr: true, // Enable SSR for better SEO
  keepalive: true
})

// Add SEO meta tags for blog index page
useSeoMeta({
  title: 'Moon Blog | Lunatrack',
  description: 'Explore our collection of articles about the moon, lunar phases, and celestial events',
  ogTitle: 'Moon Blog | Lunatrack',
  ogDescription: 'Explore our collection of articles about the moon, lunar phases, and celestial events',
  ogImage: '/images/moon-phase-images/full-moon.png',
  ogUrl: 'https://lunatrack.info/blog',
  twitterTitle: 'Moon Blog | Lunatrack',
  twitterDescription: 'Explore our collection of articles about the moon, lunar phases, and celestial events',
  twitterImage: '/images/moon-phase-images/full-moon.png',
  twitterCard: 'summary_large_image',
})

// Add JSON-LD structured data for blog index
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Moon Blog | Lunatrack',
        description: 'Explore our collection of articles about the moon, lunar phases, and celestial events',
        url: 'https://lunatrack.info/blog',
        publisher: {
          '@type': 'Organization',
          name: 'Lunatrack',
          logo: {
            '@type': 'ImageObject',
            url: 'https://lunatrack.info/images/logo.png'
          }
        }
      })
    }
  ]
})

// Get the Apollo configuration
const config = useRuntimeConfig()

// Define blog post interface 
interface BlogPost {
  title: string
  slug: string
  date: string
  excerpt?: string
  tags?: string[]
  referenceUrls?: string[]
  coverImage?: {
    url: string
  }
  author?: {
    name: string
  }
  images?: Array<{
    id: string
    url: string
  }>
}

// Define query result interface
interface PostsQueryResult {
  posts?: BlogPost[]
}

// Define the query for fetching posts summary
const query = gql`
  query GetPosts {
    posts {
      title
      slug
      date
      excerpt
      tags
      referenceUrls
      coverImage {
        url
      }
      author {
        name
      }
      images {
        id
        url
      }
    }
  }
`

// Data fetching with Apollo and better error handling
const { data, pending, error } = await useAsyncQuery<PostsQueryResult>(query, {
  clientId: 'default',
  context: {
    errorPolicy: 'all'
  },
  onError: (err: any) => {
    console.error('GraphQL Error:', err)
    // Return empty data during build
    if (process.server) {
      return { posts: [] }
    }
  }
})

// Computed posts with better error handling
const posts = computed(() => {
  try {
    if (pending.value) return []
    if (error.value) {
      console.error('Error fetching posts:', error.value)
      return []
    }
    return data.value?.posts || []
  } catch (e) {
    console.error('Error processing posts:', e)
    return []
  }
})

// Helper function to format date
function formatDate(dateString: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}
</script>