<template>
  <div class="inline-flex h-11 min-w-0 items-center gap-2 rounded-xl border border-line bg-white/[0.06] px-3 sm:h-10">
    <AppIcon name="pin" :size="16" class="text-glow-300" />
    <span class="truncate text-base text-moon-50">{{ city }}</span>
    <span v-if="hint" class="sr-only">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ city: string; hint?: string }>()
</script>
