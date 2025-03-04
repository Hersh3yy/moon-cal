<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <p class="text-lg text-gray-600">Loading post...</p>
    </div>

    <div v-else-if="errorMessage" class="text-red-500 bg-red-50 p-4 rounded-lg mb-6">
      <p>Error loading post: {{ errorMessage }}</p>
      <pre class="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">{{ debugInfo }}</pre>
      <NuxtLink to="/blog" class="text-blue-500 hover:text-blue-600 mt-4 inline-block">
        ← Back to Blog
      </NuxtLink>
    </div>

    <article v-else-if="post" class="max-w-3xl mx-auto">
      <img v-if="post.coverImage && post.coverImage.url" :src="post.coverImage.url" :alt="post.title"
        class="w-full h-64 object-cover rounded-lg mb-8">

      <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>

      <div class="text-gray-600 mb-8">
        {{ formatDate(post.date) }}
        <span v-if="post.author && post.author.name" class="ml-2">
          by {{ post.author.name }}
        </span>
      </div>

      <!-- Post content -->
      <div class="prose prose-lg max-w-none mb-8">
        <div v-if="contentHtml" v-html="contentHtml"></div>
        <p v-else-if="post.excerpt">{{ post.excerpt }}</p>
        <p v-else>Content unavailable</p>
      </div>

      <!-- Reference URLs if available -->
      <div v-if="post.referenceUrls && post.referenceUrls.length > 0" class="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">References</h3>
        <ul class="list-disc pl-5">
          <li v-for="(url, index) in post.referenceUrls" :key="index" class="mb-1">
            <a :href="url" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline break-words">
              {{ url }}
            </a>
          </li>
        </ul>
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { gql } from 'graphql-tag'

// Define the route and slug
const route = useRoute()
const slug = computed(() => {
  const slugParam = route.params.slug
  return typeof slugParam === 'string' ? slugParam :
    Array.isArray(slugParam) ? slugParam[0] : ''
})

// Debug info
const debugInfo = ref('')

// State variables
const loading = ref(true)
const errorMessage = ref('')
const postData = ref(null)
const contentHtml = ref('')

// Make sure we have a valid slug before proceeding
if (!slug.value) {
  errorMessage.value = 'Invalid slug parameter'
  loading.value = false
} else {
  // Log the slug we're using
  console.log('Fetching post with slug:', slug.value)

  // Define the query
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
        referenceUrls
        locale
      }
    }
  `

  try {
    // Execute the query
    const { data, error } = await useAsyncQuery(query, {
      slug: slug.value
    })

    // Log debug information
    console.log('Query variables:', { slug: slug.value })
    console.log('GraphQL Response:', { data, error })

    if (error.value) {
      // Handle error
      console.error('GraphQL Error:', error.value)
      const errorObj = error.value

      // Create a readable error message
      if (typeof errorObj === 'object' && errorObj !== null) {
        errorMessage.value = errorObj.message || 'Error fetching post'
        // Store debug info
        debugInfo.value = `Status: ${errorObj.statusCode || 'unknown'}\n`

        if (errorObj.networkError) {
          debugInfo.value += `Network: ${errorObj.networkError}\n`
        }

        if (errorObj.graphQLErrors && errorObj.graphQLErrors.length) {
          debugInfo.value += `GraphQL Errors: ${JSON.stringify(errorObj.graphQLErrors)}\n`
        }
      } else {
        errorMessage.value = 'Unknown error occurred'
      }
    } else if (data.value) {
      // Handle successful response
      if (data.value.post) {
        postData.value = data.value.post

        // Process the content if available
        if (postData.value.content && postData.value.content.json) {
          contentHtml.value = renderContentJson(postData.value.content.json)
        }
      } else if (typeof data.value === 'object' && data.value !== null && '_value' in data.value) {
        // Handle RefImpl structure
        const rawValue = data.value._value || data.value._rawValue
        if (rawValue && rawValue.post) {
          postData.value = rawValue.post

          // Process the content if available
          if (postData.value.content && postData.value.content.json) {
            contentHtml.value = renderContentJson(postData.value.content.json)
          }
        } else {
          errorMessage.value = 'Post not found'
        }
      } else {
        errorMessage.value = 'Post not found'
      }
    } else {
      errorMessage.value = 'Post not found'
    }
  } catch (e) {
    // Handle any unexpected errors
    console.error('Error executing query:', e)
    errorMessage.value = e instanceof Error ? e.message : 'An unexpected error occurred'
    debugInfo.value = e instanceof Error ? e.stack || '' : String(e)
  } finally {
    loading.value = false
  }
}

// Helper function to format date
function formatDate(dateString) {
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
function renderContentJson(contentJson) {
  try {
    if (!contentJson || !contentJson.children) {
      return '<p>No content available</p>'
    }

    // Function to process a single block
    function processBlock(block) {
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
    function processChildren(children) {
      if (!children) return ''
      return children.map(child => {
        if (child.type) {
          return processBlock(child)
        } else if (child.text !== undefined) {
          let text = child.text
          if (child.bold) text = `<strong>${text}</strong>`
          if (child.italic) text = `<em>${text}</em>`
          if (child.underline) text = `<u>${text}</u>`
          if (child.href) text = `<a href="${child.href}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${text}</a>`
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

// Define post as a computed property
const post = computed(() => postData.value || null)

// Add SEO when post is available
if (post.value) {
  useSeo({
    title: post.value.title ? `${post.value.title} | Lunatrack Blog` : 'Lunatrack Blog',
    description: post.value.excerpt || `Read about ${post.value.title} on Lunatrack`,
    type: 'article',
    image: post.value.coverImage?.url,
    author: post.value.author?.name || 'Lunatrack',
    publishedTime: post.value.date,
  })
}
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