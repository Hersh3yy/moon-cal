<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      Loading post...
    </div>
    
    <div v-else-if="error" class="text-red-500">
      Error loading post
    </div>
    
    <article v-else-if="post" class="max-w-3xl mx-auto">
      <img 
        v-if="post.coverImage" 
        :src="post.coverImage.url" 
        :alt="post.title" 
        class="w-full h-64 object-cover rounded-lg mb-8"
      >
      
      <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
      
      <div class="text-gray-600 mb-8">
        {{ new Date(post.createdAt).toLocaleDateString() }}
      </div>
      
      <div class="prose prose-lg max-w-none" v-html="post.content" />
      
      <div class="mt-8">
        <NuxtLink to="/blog" class="text-blue-500 hover:text-blue-600">
          ← Back to Blog
        </NuxtLink>
      </div>
    </article>
    
    <div v-else class="text-center">
      Post not found
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

const query = /* GraphQL */ `
  query GetBlogPost($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      content
      slug
      coverImage {
        url
      }
      createdAt
    }
  }
`

const { data, pending: loading, error } = await useAsyncQuery(query, {
  slug: slug
})

const post = computed(() => data.value?.post)
</script> 