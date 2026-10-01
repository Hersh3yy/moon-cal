<template>
  <article class="glass group relative flex flex-col overflow-hidden transition-transform duration-300 ease-soft hover:-translate-y-0.5">
    <img
      v-if="post.coverImage"
      :src="post.coverImage.url"
      :srcset="post.coverImage.srcset"
      sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
      :alt="post.coverImage.alt ?? ''"
      :width="post.coverImage.width"
      :height="post.coverImage.height"
      class="aspect-[16/9] w-full object-cover"
      loading="lazy"
      decoding="async"
    />
    <div class="flex flex-1 flex-col gap-3 p-5">
      <h2 class="text-xl font-semibold leading-snug text-moon-50">
        <NuxtLink :to="`/blog/${post.slug}`" class="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {{ post.title }}
        </NuxtLink>
      </h2>
      <p class="line-clamp-3 text-sm text-moon-300">{{ post.excerpt }}</p>
      <div class="mt-auto flex flex-col gap-2 pt-1">
        <ul v-if="post.tags.length" class="flex flex-wrap gap-1.5" aria-label="Tags">
          <li v-for="tag in post.tags" :key="tag"><Pill>{{ tag }}</Pill></li>
        </ul>
        <PostMeta :date="post.date" :reading-minutes="post.readingMinutes" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PostSummary } from '~/types/post'

defineProps<{ post: PostSummary }>()
</script>
