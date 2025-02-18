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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gql } from 'graphql-tag'

// Define the slug from the route
const route = useRoute()
const slug = route.params.slug

interface Author {
  name: string;
  bio?: string;
}

interface SEO {
  keywords?: string;
  metaDescription?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  coverImage?: {
    url: string;
  };
  createdAt: string;
  excerpt?: string;
  author?: Author;
  seo?: SEO;
}

interface PostResponse {
  post: Post;
}

const { data, pending: loading, error } = await useAsyncQuery<PostResponse>(gql`
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
      excerpt
      author {
        name
        bio
      }
      seo {
        keywords
        metaDescription
      }
    }
  }
`, { slug })

const post = computed(() => data.value?.post)

// Add SEO when post is available
watch(post, (newPost) => {
  if (newPost) {
    // Basic SEO setup
    useSeo({
      title: `${newPost.title} | Lunatrack Blog`,
      description: newPost.seo?.metaDescription || newPost.excerpt || `Read about ${newPost.title} on Lunatrack`,
      type: 'article',
      image: newPost.coverImage?.url,
      keywords: newPost.seo?.keywords?.split(',') || ['moon', 'lunar', 'astronomy', 'celestial'],
      author: newPost.author?.name || 'Lunatrack',
      publishedTime: newPost.createdAt,
    })

    // Add article structured data
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: newPost.title,
            image: newPost.coverImage?.url,
            datePublished: newPost.createdAt,
            dateModified: newPost.createdAt,
            author: {
              '@type': 'Person',
              name: newPost.author?.name || 'Lunatrack',
              description: newPost.author?.bio
            },
            publisher: {
              '@type': 'Organization',
              name: 'Lunatrack',
              logo: {
                '@type': 'ImageObject',
                url: 'https://lunatrack.info/logo.png'
              }
            },
            description: newPost.excerpt || newPost.seo?.metaDescription,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://lunatrack.info/blog/${newPost.slug}`
            }
          })
        }
      ]
    })
  }
}, { immediate: true })
</script> 