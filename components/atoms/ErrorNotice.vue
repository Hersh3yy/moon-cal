<template>
  <div role="alert" class="glass border-red-300/30 p-4 text-sm text-red-100">
    <p>{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
</script>
