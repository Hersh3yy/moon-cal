<template>
  <div class="flex flex-col items-center gap-3 text-center">
    <p class="font-sans text-base text-moon-300">
      <time :datetime="todayIso">{{ today }}</time>
    </p>
    <LocationSelector />
  </div>
</template>

<script setup lang="ts">
import { formatDate, isoDate } from '~/utils/dates'

const now = ref(new Date())
const today = computed(() => formatDate(now.value, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
const todayIso = computed(() => isoDate(now.value))
onMounted(() => (now.value = new Date()))
</script>
