<template>
  <div class="flex items-baseline justify-between gap-4">
    <dt class="text-sm text-muted">{{ label }}</dt>
    <dd class="text-right font-display text-base tabular-nums text-moon-50">
      <slot>{{ value ?? '—' }}</slot>
    </dd>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string | number | null }>()
</script>
