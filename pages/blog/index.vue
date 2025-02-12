<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Moon Blog</h1>
    
    <div v-if="loading" class="text-center">
      Loading posts...
    </div>
    
    <div v-else-if="error" class="text-red-500">
      Error loading posts
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in posts" :key="post.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <img v-if="post.coverImage" :src="post.coverImage.url" :alt="post.title" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
          <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
          <NuxtLink :to="'/blog/' + post.slug" class="text-blue-500 hover:text-blue-600">
            Read more →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const query = gql`
  query GetBlogPosts {
    posts {
      id
      title
      excerpt
      slug
      coverImage {
        url
      }
      createdAt
    }
  }
`

const { data, pending: loading, error } = await useAsyncQuery(query)
const posts = computed(() => data.value?.posts || [])
</script>