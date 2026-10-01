<template>
  <BaseCard title="Distance from Earth">
    <p class="font-display text-2xl text-moon-50">{{ formatKm(distance?.km) }}</p>
    <p class="mt-1 text-sm text-muted">
      <template v-if="distance">
        Looks {{ Math.abs(distance.vsMeanPct) }}% {{ distance.vsMeanPct >= 0 ? 'bigger' : 'smaller' }} than average · {{ distance.arcmin.toFixed(1) }}′ across
      </template>
    </p>
    <div class="mt-4">
      <DistanceGauge v-if="distance" :fraction="distance.fraction" />
    </div>
    <p v-if="distance?.isNearPerigee" class="mt-3 text-sm text-glow-300">Near perigee — if a full moon lands here it is a supermoon.</p>
    <p v-else-if="distance?.isNearApogee" class="mt-3 text-sm text-moon-300">Near apogee — the moon at its smallest.</p>
  </BaseCard>
</template>

<script setup lang="ts">
import { formatKm } from '~/utils/format'

const { distance } = useMoon()
</script>
