<template>
  <p v-if="text" class="mx-auto max-w-prose text-balance text-center text-base text-moon-300">{{ text }}</p>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>
