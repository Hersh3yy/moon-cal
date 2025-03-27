<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <p class="text-lg text-gray-600">Loading post...</p>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" 
      class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300"
      :class="{ 'opacity-100': showToast, 'opacity-0': !showToast }"
    >
      {{ toastMessage }}
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
          
          <div class="flex items-center gap-2">
            <!-- Social Share Buttons -->
            <div class="flex items-center gap-2">
              <!-- Twitter/X Share -->
              <button 
                @click="shareToTwitter" 
                class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                title="Share on Twitter/X"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </button>
              
              <!-- Facebook Share -->
              <button 
                @click="shareToFacebook" 
                class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                title="Share on Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              
              <!-- LinkedIn Share -->
              <button 
                @click="shareToLinkedIn" 
                class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                title="Share on LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                </svg>
              </button>
            </div>
            
            <!-- Copy Link Button -->
            <button 
              @click="copyLink" 
              class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              title="Copy link to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Copy Link
            </button>
          </div>
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
    keywords?: string[]
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
      loading.value = false
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
          keywords
        }
      }
    `

    // Using try/catch with more resilient error handling
    try {
      const { data, error: queryError } = await useAsyncQuery(query, { slug: slug.value })

      if (queryError.value) {
        console.error("GraphQL error:", queryError.value)
        throw queryError.value
      }

      if (data.value?.post) {
        fullPostData.value = data.value.post
        if (fullPostData.value.content?.json) {
          contentHtml.value = renderContentJson(fullPostData.value.content.json)
        }
        postsStore.updatePost(fullPostData.value)
      } else {
        await fetchAllPosts()
        const refreshedPost = postsStore.getPost(slug.value)
        if (refreshedPost) {
          fullPostData.value = refreshedPost
          if (refreshedPost.content?.json) {
            contentHtml.value = renderContentJson(refreshedPost.content.json)
          }
        } else {
          throw new Error('Post not found')
        }
      }
    } catch (queryErr) {
      console.error('Failed to fetch individual post:', queryErr)
      // Try fetching all posts as a fallback
      await fetchAllPosts()
      
      // Check again after fetching all posts
      const refreshedPost = postsStore.getPost(slug.value)
      if (refreshedPost) {
        fullPostData.value = refreshedPost
        if (refreshedPost.content?.json) {
          contentHtml.value = renderContentJson(refreshedPost.content.json)
        }
      } else {
        throw new Error('Post not found after retry')
      }
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

// Function to fetch all posts as fallback
const fetchAllPosts = async () => {
  try {
    const query = gql`
      query GetAllBlogPosts {
        posts {
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

    const { data } = await useAsyncQuery(query)
    
    if (data.value?.posts) {
      postsStore.setPosts(data.value.posts)
    }
  } catch (e) {
    console.error('Error fetching all posts:', e)
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
    // Generate canonical URL for SEO
    const canonicalUrl = process.client 
      ? `${window.location.origin}/blog/${newPost.slug}` 
      : `https://lunatrack.info/blog/${newPost.slug}`;
    
    // Gather keywords from the post or use defaults
    const keywords = newPost.keywords || [
      'moon', 'lunar', 'astronomy', 'celestial', 'blog', 'lunatrack'
    ];
    
    useSeo({
      title: newPost.title ? `${newPost.title} | Lunatrack Blog` : 'Lunatrack Blog',
      description: newPost.excerpt || `Read about ${newPost.title} on Lunatrack`,
      type: 'article',
      image: newPost.coverImage?.url,
      author: newPost.author?.name || 'Lunatrack',
      publishedTime: newPost.date,
      canonical: canonicalUrl,
      keywords: keywords
    })

    // Add structured data for better SEO
    useHead({
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl
        }
      ],
      meta: [
        // Add additional metadata for better SEO
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: newPost.title },
        { name: 'twitter:description', content: newPost.excerpt || `Read about ${newPost.title} on Lunatrack` },
        { name: 'twitter:image', content: newPost.coverImage?.url },
        // Add article-specific OpenGraph tags
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: newPost.title },
        { property: 'og:description', content: newPost.excerpt || `Read about ${newPost.title} on Lunatrack` },
        { property: 'og:image', content: newPost.coverImage?.url },
        { property: 'og:url', content: canonicalUrl },
        { property: 'article:published_time', content: newPost.date }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: newPost.title,
            image: newPost.coverImage?.url,
            datePublished: newPost.date,
            dateModified: newPost.date,
            description: newPost.excerpt || `Read about ${newPost.title} on Lunatrack`,
            keywords: keywords.join(', '),
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
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl
            },
            url: canonicalUrl
          })
        }
      ]
    })
  }
}, { immediate: true })

// Share functionality
const shareToTwitter = () => {
  const text = `${post.value?.title || 'Check out this blog post!'}`
  const url = generateShareUrl()
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
}

const shareToFacebook = () => {
  const url = generateShareUrl()
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
}

const shareToLinkedIn = () => {
  const url = generateShareUrl()
  const title = post.value?.title || 'Lunatrack Blog Post'
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank')
}

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')

// Show a toast notification
const showNotification = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Generate a canonical URL for sharing
const generateShareUrl = () => {
  // Use window.location.origin to ensure we have the full domain
  const origin = process.client ? window.location.origin : 'https://lunatrack.info'
  return `${origin}/blog/${slug.value}?ref=share`
}

// Copy link to clipboard
const copyLink = () => {
  const url = generateShareUrl()
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showNotification('Link copied to clipboard!')
    }).catch(err => {
      console.error('Failed to copy: ', err)
      fallbackCopy(url)
    })
  } else {
    fallbackCopy(url)
  }
}

const fallbackCopy = (url: string) => {
  // Fallback for browsers without clipboard API
  const textArea = document.createElement('textarea')
  textArea.value = url
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    showNotification('Link copied to clipboard!')
  } catch (err) {
    console.error('Fallback: Could not copy text: ', err)
    prompt('Copy this link to share:', url)
  }
  
  document.body.removeChild(textArea)
}

// Deprecated old share function
const sharePost = () => {
  copyLink()
}

// Define page meta for improved SSR handling
definePageMeta({
  validate: async (route) => {
    // This is a very basic validation just to ensure the route has a slug parameter
    return !!route.params.slug;
  },
  keepalive: true
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