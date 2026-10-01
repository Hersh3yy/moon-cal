<template>
  <article v-if="post" class="mx-auto max-w-prose">
    <NuxtLink to="/blog" class="link inline-flex items-center gap-1 text-sm"><AppIcon name="arrow-left" :size="14" /> All posts</NuxtLink>

    <header class="mt-5">
      <h1 class="text-balance text-3xl font-semibold leading-tight text-moon-50 sm:text-4xl">{{ post.title }}</h1>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <PostMeta :date="post.date" :reading-minutes="post.readingMinutes" :author="post.author" />
        <ShareButton :title="post.title" :url="url" :text="post.excerpt" />
      </div>
      <ul v-if="post.tags.length" class="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
        <li v-for="tag in post.tags" :key="tag"><Pill>{{ tag }}</Pill></li>
      </ul>
    </header>

    <img
      v-if="post.coverImage"
      :src="post.coverImage.url"
      :srcset="post.coverImage.srcset"
      sizes="(min-width: 768px) 42rem, 100vw"
      :alt="post.coverImage.alt ?? ''"
      :width="post.coverImage.width"
      :height="post.coverImage.height"
      class="mt-8 aspect-[16/9] w-full rounded-card object-cover"
      fetchpriority="high"
      decoding="async"
    />

    <div class="prose-moon mt-8" v-html="post.html" />

    <section v-if="post.images.length" class="mt-10" aria-labelledby="gallery-title">
      <h2 id="gallery-title" class="text-xl font-semibold text-moon-50">Gallery</h2>
      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <img v-for="image in post.images" :key="image.url" :src="image.url" :srcset="image.srcset" sizes="(min-width: 640px) 21rem, 100vw" :alt="image.alt ?? ''" :width="image.width" :height="image.height" class="h-auto w-full rounded-xl" loading="lazy" decoding="async" />
      </div>
    </section>

    <section v-if="post.references.length" class="glass mt-10 p-5" aria-labelledby="refs-title">
      <h2 id="refs-title" class="text-base font-semibold text-moon-50">References</h2>
      <ol class="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
        <li v-for="ref in post.references" :key="ref"><a :href="ref" class="link break-words" target="_blank" rel="noopener">{{ ref }}</a></li>
      </ol>
    </section>

    <footer class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
      <NuxtLink to="/blog" class="link inline-flex items-center gap-1 text-sm"><AppIcon name="arrow-left" :size="14" /> All posts</NuxtLink>
      <NuxtLink to="/" class="link text-sm">See tonight's moon</NuxtLink>
    </footer>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const { siteUrl } = useRuntimeConfig().public

const { data: post, error } = await usePost(slug)

if (!post.value) {
  const status = (error.value as { statusCode?: number } | null)?.statusCode
  throw createError({ statusCode: status === 404 || !error.value ? 404 : 502, statusMessage: status === 404 || !error.value ? 'Post not found' : 'The blog is unavailable right now', fatal: true })
}

const url = computed(() => `${siteUrl}/blog/${post.value?.slug}`)

useSeo({
  title: post.value.title,
  description: post.value.excerpt,
  image: post.value.coverImage?.url,
  type: 'article',
  publishedTime: post.value.date,
  modifiedTime: post.value.updatedAt,
  author: post.value.author,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        description: post.value.excerpt,
        image: post.value.coverImage?.url ? [post.value.coverImage.url] : undefined,
        datePublished: post.value.date,
        dateModified: post.value.updatedAt ?? post.value.date,
        wordCount: post.value.wordCount,
        keywords: post.value.tags.join(', ') || undefined,
        author: { '@type': 'Person', name: post.value.author || 'Lunatrack' },
        publisher: { '@id': `${siteUrl}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url.value },
      }),
    },
  ],
})
</script>
