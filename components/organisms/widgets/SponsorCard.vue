<template>
  <BaseCard :title="title" :col-span="colSpan">
    <a :href="href" class="group flex flex-col gap-3 no-underline" target="_blank" rel="noopener sponsored">
      <span class="text-xs uppercase tracking-wider text-muted">Sponsor</span>
      <img :src="imgSrc" :alt="`${sponsorName} logo`" class="max-h-40 w-full rounded-xl object-cover" loading="lazy" decoding="async" />
      <span class="font-sans text-lg font-semibold text-moon-50 group-hover:underline">{{ sponsorName }}</span>
      <span class="text-sm text-moon-300">{{ description }}</span>
    </a>
  </BaseCard>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; sponsorName: string; description: string; imgSrc: string; href: string; colSpan?: 1 | 2 }>(), { colSpan: 1 })
</script>
