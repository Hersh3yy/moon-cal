<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <p class="text-lg text-gray-600">Loading post...</p>
    </div>

    <div v-else-if="error" class="text-red-500 bg-red-50 p-4 rounded-lg mb-6">
      <p>Error loading post: {{ error.message || 'An error occurred while fetching data' }}</p>
      <pre v-if="debugInfo" class="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">{{ debugInfo }}</pre>
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

      <!-- Reference URLs if available -->
      <div v-if="post.referenceUrls?.length" class="mt-8 p-4 bg-gray-50 rounded-lg">
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
        <div class="flex items-center justify-between">
          <NuxtLink to="/blog" class="text-blue-500 hover:text-blue-600">
            ← Back to Blog
          </NuxtLink>
          
          <button 
            @click="sharePost" 
            class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Share
          </button>
        </div>
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
import { usePostsStore } from '~/stores/posts'

// Initialize the posts store
const postsStore = usePostsStore()

// Define the route and slug
const route = useRoute()
const slug = computed(() => route.params.slug)

// State variables
const loading = ref(true)
const error = ref<Error | null>(null)
const debugInfo = ref('')
const contentHtml = ref('')
const fullPostData = ref<any>(null)

// Define the GraphQL response type
interface PostResponse {
  post: {
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
}

// Check if we already have this post's basic info
const existingPostInfo = computed(() =>
  postsStore.getPost(slug.value)
)

// Create a function to load the full post
const loadFullPost = async () => {
  loading.value = true
  error.value = null
  debugInfo.value = ''
  contentHtml.value = ''

  try {
    // Check if we have the full post data in the store
    const storePost = postsStore.getPost(slug.value)
    if (storePost?.content?.json) {
      fullPostData.value = storePost
      contentHtml.value = renderContentJson(storePost.content.json)
      return
    }

    // Fetch from GraphQL if not in store
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

    const { data, error: queryError } = await useAsyncQuery(query, { slug: slug.value })

    if (queryError.value) {
      throw queryError.value
    }

    if (data.value?.post) {
      fullPostData.value = data.value.post
      if (fullPostData.value.content?.json) {
        contentHtml.value = renderContentJson(fullPostData.value.content.json)
      }
      postsStore.updatePost(fullPostData.value)
    } else {
      throw new Error('Post not found')
    }
  } catch (e) {
    error.value = e as Error
    console.error('Error loading post:', e)
    if (e instanceof Error) {
      debugInfo.value = e.stack || e.message
    } else {
      debugInfo.value = String(e)
    }
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

// Create a computed property that combines store data with fetched data
const post = computed(() => {
  if (fullPostData.value) return fullPostData.value
  if (existingPostInfo.value) return existingPostInfo.value
  return null
})

// Watch for route changes to load the post
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadFullPost()
  }
})

// Initial load
onMounted(() => {
  loadFullPost()
})

// Add SEO when post is available
watch(post, (newPost) => {
  if (newPost) {
    useSeo({
      title: newPost.title ? `${newPost.title} | Lunatrack Blog` : 'Lunatrack Blog',
      description: newPost.excerpt || `Read about ${newPost.title} on Lunatrack`,
      type: 'article',
      image: newPost.coverImage?.url,
      author: newPost.author?.name || 'Lunatrack',
      publishedTime: newPost.date,
    })

    // Add structured data for better SEO
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: newPost.title,
            image: newPost.coverImage?.url,
            datePublished: newPost.date,
            author: {
              '@type': 'Person',
              name: newPost.author?.name || 'Lunatrack'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Lunatrack',
              logo: {
                '@type': 'ImageObject',
                url: 'https://lunatrack.info/logo.png'
              }
            }
          })
        }
      ]
    })
  }
}, { immediate: true })

// Share functionality
const sharePost = () => {
  const currentUrl = window.location.href;
  const shareUrl = currentUrl.includes('?') 
    ? `${currentUrl}&ref=share` 
    : `${currentUrl}?ref=share`;
  
  if (navigator.share) {
    // Use Web Share API if available
    navigator.share({
      title: post.value?.title || 'Moon Calendar Blog Post',
      text: post.value?.excerpt || 'Check out this blog post!',
      url: shareUrl
    }).catch(error => {
      console.error('Error sharing:', error);
      fallbackShare(shareUrl);
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    fallbackShare(shareUrl);
  }
};

const fallbackShare = (url) => {
  // Copy to clipboard
  navigator.clipboard.writeText(url).then(() => {
    // Show a toast or notification
    alert('Link copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
    // Provide manual selection as last resort
    prompt('Copy this link to share:', url);
  });
};
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