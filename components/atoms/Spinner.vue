<template>
  <div role="status" class="flex justify-center py-12">
    <div class="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-moon-50" />
    <span class="sr-only">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Loading moon data' })
</script>
