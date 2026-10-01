<template>
  <NuxtLayout>
    <section class="mx-auto max-w-md py-16 text-center">
      <p class="font-display text-6xl text-moon-50">{{ error?.statusCode ?? 500 }}</p>
      <h1 class="mt-4 text-2xl font-semibold text-moon-50">{{ is404 ? 'Lost in space' : 'Something went wrong' }}</h1>
      <p class="mt-3 text-moon-300">
        {{ is404 ? 'That page is not in this sky. It may have moved, or the link was mistyped.' : (error?.statusMessage || 'Please try again in a moment.') }}
      </p>
      <div class="mt-8 flex justify-center gap-3">
        <button type="button" class="h-11 rounded-xl bg-moon-50 px-5 font-medium text-ink transition-colors hover:bg-white" @click="goHome">Tonight's moon</button>
        <NuxtLink to="/blog" class="inline-flex h-11 items-center rounded-xl border border-line bg-white/[0.06] px-5 font-medium text-moon-50 hover:bg-white/[0.14]">Blog</NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error?.statusCode === 404)

useSeoMeta({ title: is404.value ? 'Page not found' : 'Error', robots: 'noindex' })

function goHome() {
  clearError({ redirect: '/' })
}
</script>
