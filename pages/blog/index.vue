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
          <p class="text-gray-600 mb-4">{{ post.excerpt || extractExcerpt(post) }}</p>
          <NuxtLink :to="'/blog/' + post.slug" class="text-blue-500 hover:text-blue-600">
            Read more →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { gql } from 'graphql-tag'
import { usePostsStore } from '~/stores/posts'

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

interface QueryResponse {
  posts: Post[]
}

// Initialize the posts store
const postsStore = usePostsStore()

// Define the query for fetching posts summary
const query = gql`
  query GetPosts {
    posts {
      title
      slug
      date
      excerpt
      keywords
      content {
        json
      }
      coverImage {
        url
      }
      author {
        name
        biography
      }
      referenceUrls
      locale
      seoOverride {
        id
      }
    }
  }
`

// Data fetching with Apollo
const { data, loading, error } = await useAsyncQuery(query)

// Debugging: Log the response data
console.log('Fetched posts data:', data.value)

// Safely access posts data
const posts = computed(() => {
  if (loading && loading.value) {
    console.log('Loading posts...')
    return [] // Return an empty array while loading
  }
  
  if (error && error.value) {
    console.error('Error fetching posts:', error.value)
    return [] // Return an empty array if there's an error
  }

  // Ensure data and posts are defined before accessing
  if (data.value && data.value.posts && Array.isArray(data.value.posts)) {
    return data.value.posts
  } else {
    console.warn('Posts data is not an array or is undefined:', data.value)
    return []
  }
})

// Debugging: Log any errors
if (error && error.value) {
  console.error('Error fetching posts:', error.value)
}

// Watch for data changes and update store
watch(data, (newData) => {
  if (newData?.posts) {
    postsStore.setPosts(newData.posts)
  }
}, { immediate: true })

// Helper function to extract excerpt from content when excerpt is null
function extractExcerpt(post: Post): string {
  if (post.content?.json?.children) {
    // Try to find the first paragraph
    const firstParagraph = post.content.json.children.find((child: any) =>
      child.type === 'paragraph' &&
      child.children &&
      child.children.length > 0 &&
      child.children.some((c: any) => c.text && c.text.trim().length > 0)
    )

    if (firstParagraph) {
      // Extract and combine all text from the paragraph
      const text = firstParagraph.children
        .map((child: any) => child.text || '')
        .join('')
        .trim()

      // Return the first 120 characters with ellipsis if needed
      if (text.length > 120) {
        return text.substring(0, 120) + '...'
      }
      return text
    }
  }
  return 'Read this article about the moon and its influence...'
}

// Add SEO for blog index page
useSeo({
  title: 'Moon Blog | Lunatrack',
  description: 'Explore our collection of articles about the moon, lunar phases, celestial events, and astronomical phenomena.',
  type: 'website',
  keywords: [
    'moon blog',
    'lunar articles',
    'moon phases',
    'celestial events',
    'astronomy blog',
    'lunar phenomena',
    'moon facts',
    'astronomical articles'
  ]
})

// Add blog listing structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Lunatrack Moon Blog',
        description: 'Explore our collection of articles about the moon, lunar phases, celestial events, and astronomical phenomena.',
        url: 'https://lunatrack.info/blog',
        publisher: {
          '@type': 'Organization',
          name: 'Lunatrack',
          logo: {
            '@type': 'ImageObject',
            url: 'https://lunatrack.info/logo.png'
          }
        },
        blogPost: posts.value.map(post => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: `https://lunatrack.info/blog/${post.slug}`,
          image: post.coverImage?.url,
          datePublished: post.date,
          description: post.excerpt || extractExcerpt(post),
          author: post.author?.name ? {
            '@type': 'Person',
            name: post.author.name
          } : undefined
        }))
      })
    }
  ]
})
</script>