<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink-2/80 backdrop-blur-md">
    <div class="relative mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6">
      <AppLogo />
      <NavMenu :items="items" @select="onSelect" />
    </div>
    <AboutModal v-model:open="aboutOpen" />
  </header>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types/ui'

const items: NavItem[] = [
  { label: 'Blog', to: '/blog' },
  { label: 'About', action: 'about' },
]
const aboutOpen = ref(false)

function onSelect(item: NavItem) {
  if (item.action === 'about') aboutOpen.value = true
}

onMounted(() => {
  if (window.location.hash === '#about') aboutOpen.value = true
})
</script>
