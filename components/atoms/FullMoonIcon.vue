<template>
  <img v-if="kind" :src="kind.icon" alt="" width="48" height="48" class="h-12 w-12 shrink-0 object-contain" loading="lazy" decoding="async" />
  <span v-else class="inline-flex h-12 w-12 shrink-0 items-center justify-center text-moon-300"><AppIcon name="moon" :size="28" /></span>
</template>

<script setup lang="ts">
import type { FullMoonKind } from '~/data/fullMoons'

defineProps<{ kind: FullMoonKind | null }>()
</script>
