<template>
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" class="pointer-events-none absolute inset-0 h-full w-full -rotate-90">
    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
    <circle
      cx="50"
      cy="50"
      r="48"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      class="transition-[stroke-dashoffset] duration-1000 ease-soft"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ value: number | null }>()
const circumference = 2 * Math.PI * 48
const offset = computed(() => {
  const v = Math.min(100, Math.max(0, props.value ?? 0))
  return circumference * (1 - v / 100)
})
</script>
