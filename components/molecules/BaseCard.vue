<template>
  <section
    class="glass flex flex-col gap-3 p-5 md:p-6"
    :class="colSpan === 2 ? 'sm:col-span-2' : ''"
    :aria-labelledby="title ? headingId : undefined"
  >
    <div v-if="title || $slots.header" class="flex items-center justify-between gap-3">
      <h2 v-if="title" :id="headingId" class="text-sm font-medium uppercase tracking-wider text-muted">{{ title }}</h2>
      <slot name="header" />
    </div>
    <div class="flex-1">
      <slot />
    </div>
    <slot name="footer" />
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; colSpan?: 1 | 2 }>(), { colSpan: 1 })
const headingId = useId()
</script>
