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
          <p class="text-gray-600 mb-4">{{ post.excerpt || 'Read more...' }}</p>
          <NuxtLink :to="'/blog/' + post.slug" class="text-blue-500 hover:text-blue-600">
            Read more →
          </NuxtLink>
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
  ssr: false, // Disable SSR for this page
  keepalive: true
})

// Define the query for fetching posts summary
const query = gql`
  query GetPosts {
    posts {
      title
      slug
      date
      excerpt
      coverImage {
        url
      }
      author {
        name
      }
    }
  }
`

// Data fetching with Apollo
const { data, pending, error } = await useAsyncQuery(query)

// Computed posts
const posts = computed(() => {
  if (pending.value) return []
  if (error.value) return []
  return data.value?.posts || []
})
</script>