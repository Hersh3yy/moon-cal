<template>
  <div>
    <header class="mb-8">
      <h1 class="font-display text-3xl text-moon-50 sm:text-4xl">Moon blog</h1>
      <p class="mt-2 max-w-prose text-moon-300">Sleep, tides, planting, moon signs, eclipses — what the moon does to us and the world around us.</p>
    </header>

    <ErrorNotice v-if="error" message="The blog could not be loaded right now." />
    <Spinner v-else-if="pending && !posts.length" label="Loading posts" />
    <p v-else-if="!posts.length" class="text-moon-300">No posts yet.</p>
    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: posts, pending, error } = await usePostList()
const { siteUrl } = useRuntimeConfig().public

useSeo({
  title: 'Moon blog',
  description: 'Articles about the moon: sleep, tides, planting by the moon, moon signs, eclipses and more.',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Lunatrack Moon blog',
        url: `${siteUrl}/blog`,
        publisher: { '@id': `${siteUrl}/#organization` },
        blogPost: (posts.value ?? []).map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${siteUrl}/blog/${p.slug}`, datePublished: p.date })),
      }),
    },
  ],
})
</script>
