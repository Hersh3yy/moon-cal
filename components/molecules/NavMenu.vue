<template>
  <nav aria-label="Main">
    <!-- Desktop -->
    <ul class="hidden items-center gap-1 md:flex">
      <li v-for="item in items" :key="item.label">
        <NuxtLink v-if="item.to" :to="item.to" class="rounded-lg px-3 py-2 text-base text-moon-100 transition-colors hover:bg-white/[0.08] hover:text-moon-50">
          {{ item.label }}
        </NuxtLink>
        <button v-else type="button" class="rounded-lg px-3 py-2 text-base text-moon-100 transition-colors hover:bg-white/[0.08] hover:text-moon-50" @click="emit('select', item)">
          {{ item.label }}
        </button>
      </li>
    </ul>

    <!-- Mobile -->
    <div class="md:hidden">
      <IconButton :label="open ? 'Close menu' : 'Open menu'" :icon="open ? 'close' : 'menu'" :expanded="open" :controls="panelId" @click="open = !open" />
      <div v-show="open" :id="panelId" class="absolute inset-x-0 top-full border-b border-line bg-ink-2/95 px-4 pb-4 pt-2 backdrop-blur-md">
        <ul class="flex flex-col">
          <li v-for="item in items" :key="item.label">
            <NuxtLink v-if="item.to" :to="item.to" class="block rounded-lg px-3 py-3 text-lg text-moon-100 hover:bg-white/[0.08]" @click="open = false">
              {{ item.label }}
            </NuxtLink>
            <button v-else type="button" class="block w-full rounded-lg px-3 py-3 text-left text-lg text-moon-100 hover:bg-white/[0.08]" @click="select(item)">
              {{ item.label }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types/ui'

defineProps<{ items: NavItem[] }>()
const emit = defineEmits<{ select: [item: NavItem] }>()

const open = ref(false)
const panelId = useId()
const route = useRoute()

watch(() => route.fullPath, () => (open.value = false))

function select(item: NavItem) {
  open.value = false
  emit('select', item)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
