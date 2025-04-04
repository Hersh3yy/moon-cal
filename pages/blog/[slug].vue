<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <p class="text-lg text-gray-600">Loading post...</p>
    </div>

    <div v-else-if="error" class="text-red-500 bg-red-50 p-4 rounded-lg mb-6">
      <p>Error loading post: {{ error.message || 'An error occurred while fetching data' }}</p>
      <NuxtLink to="/blog" class="text-blue-500 hover:text-blue-600 mt-4 inline-block">
        ← Back to Blog
      </NuxtLink>
    </div>

    <article v-else-if="post" class="max-w-3xl mx-auto">
      <img v-if="post.coverImage?.url" :src="post.coverImage.url" :alt="post.title"
        class="w-full h-64 object-cover rounded-lg mb-8">

      <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>

      <div class="text-gray-600 mb-8">
        {{ formatDate(post.date) }}
        <span v-if="post.author?.name" class="ml-2">
          by {{ post.author.name }}
        </span>
      </div>

      <!-- Post content -->
      <div class="prose prose-lg max-w-none mb-8">
        <div v-if="contentHtml" v-html="contentHtml"></div>
        <p v-else-if="post.excerpt">{{ post.excerpt }}</p>
        <p v-else>Content unavailable</p>
      </div>

      <div class="mt-8">
        <NuxtLink to="/blog" class="text-blue-500 hover:text-blue-600">
          ← Back to Blog
        </NuxtLink>
      </div>
    </article>

    <div v-else class="text-center py-8">
      <p class="text-lg text-gray-600">Post not found</p>
      <NuxtLink to="/blog" class="text-blue-500 hover:text-blue-600 mt-4 inline-block">
        ← Back to Blog
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gql } from 'graphql-tag'

// Define page meta for improved SSR handling
definePageMeta({
  ssr: false, // Disable SSR for this page
  keepalive: true
})

// Define the route and slug
const route = useRoute()
const slug = computed(() => route.params.slug)

// State variables
const loading = ref(true)
const error = ref<Error | null>(null)
const contentHtml = ref('')
const post = ref<any>(null)

// Create a function to load the post
const loadPost = async () => {
  loading.value = true
  error.value = null
  contentHtml.value = ''

  try {
    const query = gql`
      query GetBlogPost($slug: String!) {
        post(where: { slug: $slug }) {
          title
          slug
          date
          excerpt
          content {
            json
          }
          coverImage {
            url
          }
          author {
            name
          }
        }
      }
    `

    const { data, error: queryError } = await useAsyncQuery(query, { slug: slug.value })

    if (queryError.value) {
      throw queryError.value
    }

    if (data.value?.post) {
      post.value = data.value.post
      if (post.value.content?.json) {
        contentHtml.value = renderContentJson(post.value.content.json)
      }
    } else {
      throw new Error('Post not found')
    }
  } catch (e) {
    error.value = e as Error
    console.error('Error loading post:', e)
  } finally {
    loading.value = false
  }
}

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

// Helper function to render the content JSON
function renderContentJson(contentJson: any): string {
  try {
    if (!contentJson?.children) {
      return '<p>No content available</p>'
    }

    // Function to process a single block
    function processBlock(block: any): string {
      if (!block) return ''

      switch (block.type) {
        case 'paragraph':
          return `<p>${processChildren(block.children)}</p>`
        case 'heading-two':
          return `<h2>${processChildren(block.children)}</h2>`
        case 'heading-three':
          return `<h3>${processChildren(block.children)}</h3>`
        case 'heading-four':
          return `<h4>${processChildren(block.children)}</h4>`
        case 'bulleted-list':
          return `<ul>${processChildren(block.children)}</ul>`
        case 'list-item':
          return `<li>${processChildren(block.children)}</li>`
        case 'list-item-child':
          return processChildren(block.children)
        case 'table':
          return `<table class="min-w-full border-collapse border border-gray-300">${processChildren(block.children)}</table>`
        case 'table_head':
          return `<thead>${processChildren(block.children)}</thead>`
        case 'table_body':
          return `<tbody>${processChildren(block.children)}</tbody>`
        case 'table_row':
          return `<tr>${processChildren(block.children)}</tr>`
        case 'table_cell':
          return `<td class="border border-gray-300 px-4 py-2">${processChildren(block.children)}</td>`
        case 'table_header_cell':
          return `<th class="border border-gray-300 px-4 py-2 bg-gray-100">${processChildren(block.children)}</th>`
        case 'image':
          return `<img src="${block.src}" alt="${block.altText || ''}" class="max-w-full h-auto my-4 rounded" />`
        default:
          return processChildren(block.children)
      }
    }

    // Process children recursively
    function processChildren(children: any[]): string {
      if (!children) return ''
      return children.map(child => {
        if (child.type === 'link') {
          // Handle link type specifically
          const linkContent = processChildren(child.children)
          return `<a href="${child.href}" ${child.openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-blue-500 hover:text-blue-600">${linkContent}</a>`
        } else if (child.type) {
          return processBlock(child)
        } else if (child.text !== undefined) {
          let text = child.text
          if (child.bold) text = `<strong>${text}</strong>`
          if (child.italic) text = `<em>${text}</em>`
          if (child.underline) text = `<u>${text}</u>`
          return text
        }
        return ''
      }).join('')
    }

    // Process all blocks
    return contentJson.children.map(processBlock).join('')
  } catch (e) {
    console.error('Error rendering content:', e)
    return '<p>Error rendering content</p>'
  }
}

// Watch for route changes to load the post
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadPost()
  }
})

// Initial load
onMounted(() => {
  loadPost()
})
</script>

<style>
/* Styling for the rendered content */
.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.prose h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 1rem 0;
}

.prose table {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: collapse;
}

.prose table th,
.prose table td {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
}

.prose table th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>