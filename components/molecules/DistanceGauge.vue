<template>
  <div>
    <div class="relative h-2 w-full rounded-full bg-gradient-to-r from-glow-300/60 via-white/15 to-white/10" aria-hidden="true">
      <span class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-moon-50 shadow transition-[left] duration-700 ease-soft" :style="{ left: `${fraction * 100}%` }" />
    </div>
    <div class="mt-1.5 flex justify-between text-xs text-muted">
      <span>Perigee · closest</span>
      <span>Apogee · farthest</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ fraction: number }>()
</script>
