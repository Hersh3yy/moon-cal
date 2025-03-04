<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Moon Blog</h1>

    <div v-if="errorMessage" class="text-red-500 mb-6 p-4 bg-red-50 rounded-lg">
      <p>Error loading posts: {{ errorMessage }}</p>
    </div>

    <div v-else-if="loading" class="text-center py-8">
      <p class="text-lg text-gray-600">Loading blog posts...</p>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-8">
      <p class="text-lg text-gray-600">No blog posts available at the moment.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in posts" :key="post.slug" class="bg-white rounded-lg shadow-md overflow-hidden">
        <img v-if="post.coverImage && post.coverImage.url" :src="post.coverImage.url" :alt="post.title"
          class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
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
import { computed, ref } from 'vue'
import { gql } from 'graphql-tag'

const loading = ref(true)
const errorMessage = ref('')
const postsData = ref([])

const query = gql`
  query {
    posts {
      title
      slug
      date
      excerpt
      tags
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

try {
  const { data, error } = await useAsyncQuery(query)

  // Log the response for debugging
  console.log('GraphQL Response:', { data, error })

  // Check for errors
  if (error) {
    console.error('GraphQL Error:', error.value)
    errorMessage.value = typeof error.value === 'object' && error.value !== null
      ? (error.value.message || 'An error occurred while fetching data')
      : 'An error occurred while fetching data'
  }
  // Handle data safely
  else if (data.value) {
    // Safely access posts from various possible response structures
    if (data.value.posts) {
      postsData.value = data.value.posts
    } else if (typeof data.value === 'object' && data.value !== null && '_value' in data.value) {
      // Handle RefImpl structure
      const rawValue = data.value._value || data.value._rawValue
      if (rawValue && rawValue.posts) {
        postsData.value = rawValue.posts
      }
    }
  }
} catch (e) {
  console.error('Error in GraphQL query execution:', e)
  errorMessage.value = 'Failed to load blog posts. Please try again later.'
} finally {
  loading.value = false
}

// Define posts as a computed property
const posts = computed(() => {
  return postsData.value || []
})

// Helper function to extract excerpt from content when excerpt is null
function extractExcerpt(post) {
  if (post.content && post.content.json && post.content.json.children) {
    // Try to find the first paragraph
    const firstParagraph = post.content.json.children.find(child =>
      child.type === 'paragraph' &&
      child.children &&
      child.children.length > 0 &&
      child.children.some(c => c.text && c.text.trim().length > 0)
    )

    if (firstParagraph) {
      // Extract and combine all text from the paragraph
      const text = firstParagraph.children
        .map(child => child.text || '')
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
          description: post.excerpt || extractExcerpt(post)
        }))
      })
    }
  ]
})
</script>