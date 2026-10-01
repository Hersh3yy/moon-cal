<template>
  <BaseCard title="Next eclipses">
    <template #header><AppIcon name="eclipse" :size="18" class="text-moon-300" /></template>
    <ClientOnly>
      <p v-if="pending" class="text-sm text-muted" aria-live="polite">Calculating…</p>
      <p v-else-if="failed" class="text-sm text-muted">Could not compute eclipses.</p>
      <div v-else class="grid gap-4">
        <div v-if="lunar">
          <p class="text-xs font-medium uppercase tracking-wider text-muted">Lunar</p>
          <p class="font-display text-lg text-moon-50">{{ capitalize(lunar.kind) }}</p>
          <p class="text-sm text-moon-300"><time :datetime="lunar.peak.toISOString()">{{ formatDateTime(lunar.peak) }}</time></p>
          <p class="text-sm" :class="lunar.visible ? 'text-glow-300' : 'text-muted'">
            {{ lunar.visible ? `Visible from ${cityName}: Moon ${Math.round(lunar.altitudeAtPeak)}° above the horizon at maximum` : `Below the horizon from ${cityName} at maximum` }}
          </p>
        </div>
        <div v-if="solar">
          <p class="text-xs font-medium uppercase tracking-wider text-muted">Solar, from {{ cityName }}</p>
          <p class="font-display text-lg text-moon-50">{{ capitalize(solar.kind) }} · {{ Math.round(solar.obscuration * 100) }}% covered</p>
          <p class="text-sm text-moon-300"><time :datetime="solar.peak.toISOString()">{{ formatDateTime(solar.peak) }}</time></p>
        </div>
      </div>
      <template #fallback><p class="text-sm text-muted">Calculating…</p></template>
    </ClientOnly>
  </BaseCard>
</template>

<script setup lang="ts">
import { formatDateTime } from '~/utils/dates'
import { capitalize } from '~/utils/format'

const { coordinates, cityName } = useMoon()
const { lunar, solar, pending, failed } = useEclipses(coordinates)
</script>
