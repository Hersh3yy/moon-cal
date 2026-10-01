<template>
  <div class="flex w-full max-w-md flex-col items-center gap-2">
    <CityForm v-if="editing" class="w-full" :initial="cityName" :busy="busy" @submit="onSearch" @cancel="editing = false" />
    <div v-else class="flex max-w-full items-center gap-2">
      <LocationChip :city="cityName" :hint="chipHint" />
      <IconButton :label="locateLabel" icon="crosshair" :busy="busy" :disabled="busy || loading || !supported" @click="onLocate" />
      <IconButton label="Change city" icon="pencil" :disabled="busy || loading" @click="editing = true" />
    </div>

    <p class="font-display text-xs tracking-wide text-muted">{{ coordinateText }}</p>
    <div class="min-h-[2.5rem] max-w-sm">
      <p v-if="error" class="text-sm text-red-200" role="alert">{{ error }}</p>
      <p v-else-if="hint" class="text-xs text-muted">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCoordinates } from '~/utils/format'

const { coordinates, cityName, locationSource, loading } = useMoon()
const { supported, busy, error, locate, search, permissionState } = useLocation()

const editing = ref(false)
const permission = ref<PermissionState | 'unknown'>('unknown')

onMounted(async () => {
  permission.value = await permissionState()
})

const coordinateText = computed(() => formatCoordinates(coordinates.value.lat, coordinates.value.lon))
const locateLabel = computed(() => (supported.value ? 'Use my location' : 'Location not supported by this browser'))
const chipHint = computed(() => (locationSource.value === 'default' ? 'Default location' : locationSource.value === 'gps' ? 'From your device' : ''))
const hint = computed(() => {
  if (locationSource.value === 'default' && supported.value && permission.value !== 'denied') return 'Showing Amsterdam. Use the target button for your own sky.'
  if (permission.value === 'denied') return 'Location is blocked for this site in your browser; searching for a city works too.'
  return ''
})

async function onLocate() {
  const ok = await locate()
  if (ok) permission.value = 'granted'
}

async function onSearch(query: string) {
  if (await search(query)) editing.value = false
}
</script>
