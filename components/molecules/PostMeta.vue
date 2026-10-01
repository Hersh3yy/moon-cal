<template>
  <p class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
    <time :datetime="isoDate(date)">{{ formatDate(date) }}</time>
    <span aria-hidden="true">·</span>
    <span>{{ readingMinutes }} min read</span>
    <template v-if="author">
      <span aria-hidden="true">·</span>
      <span>by {{ author }}</span>
    </template>
  </p>
</template>

<script setup lang="ts">
import { formatDate, isoDate } from '~/utils/dates'

defineProps<{ date: string; readingMinutes: number; author?: string }>()
</script>
