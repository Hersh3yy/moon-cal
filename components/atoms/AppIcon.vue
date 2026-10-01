<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    class="shrink-0"
  >
    <template v-if="name === 'pin'"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></template>
    <template v-else-if="name === 'crosshair'"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></template>
    <template v-else-if="name === 'pencil'"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></template>
    <template v-else-if="name === 'close'"><path d="M18 6 6 18M6 6l12 12" /></template>
    <template v-else-if="name === 'menu'"><path d="M4 7h16M4 12h16M4 17h16" /></template>
    <template v-else-if="name === 'share'"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><path d="m16 6-4-4-4 4" /><path d="M12 2v14" /></template>
    <template v-else-if="name === 'check'"><path d="M20 6 9 17l-5-5" /></template>
    <template v-else-if="name === 'arrow-left'"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></template>
    <template v-else-if="name === 'external'"><path d="M14 3h7v7" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></template>
    <template v-else-if="name === 'sun'"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></template>
    <template v-else-if="name === 'moon'"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></template>
    <template v-else-if="name === 'eclipse'"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16 6 6 0 0 0 0-16Z" fill="currentColor" stroke="none" /></template>
  </svg>
</template>

<script setup lang="ts">
import type { IconName } from '~/types/ui'

withDefaults(defineProps<{ name: IconName; size?: number | string }>(), { size: 20 })
</script>
