<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    :aria-expanded="expanded"
    :aria-controls="controls"
    class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white/[0.06] text-moon-50 transition-colors hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
    :class="{ 'animate-pulse': busy }"
  >
    <AppIcon :name="icon" :size="18" />
  </button>
</template>

<script setup lang="ts">
import type { IconName } from '~/types/ui'

defineProps<{
  label: string
  icon: IconName
  disabled?: boolean
  busy?: boolean
  expanded?: boolean
  controls?: string
}>()
</script>
