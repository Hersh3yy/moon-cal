<template>
  <BaseCard title="Moon phase">
    <div class="flex items-center gap-3">
      <span class="text-3xl" aria-hidden="true">{{ moon?.emoji }}</span>
      <div>
        <p class="font-display text-xl text-moon-50">{{ phaseName }}</p>
        <p class="text-sm text-muted">{{ capitalize(stage) }} · {{ illuminationPct != null ? `${Math.round(illuminationPct)}% lit` : '' }}</p>
      </div>
    </div>
    <div class="mt-4">
      <div class="flex justify-between text-xs text-muted"><span>New</span><span>Full</span><span>New</span></div>
      <div class="mt-1 h-1.5 w-full rounded-full bg-white/10" role="progressbar" :aria-valuenow="cyclePct ?? 0" aria-valuemin="0" aria-valuemax="100" aria-label="Lunar cycle progress">
        <div class="h-full rounded-full bg-glow-300 transition-[width] duration-700 ease-soft" :style="{ width: `${cyclePct ?? 0}%` }" />
      </div>
      <p class="mt-1.5 text-sm text-muted">{{ cyclePct != null ? `${cyclePct.toFixed(1)}% through the cycle` : '' }}<template v-if="ageDays != null"> · {{ ageDays }} days old</template></p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { capitalize } from '~/utils/format'

const { moon, phaseName, stage, illuminationPct, cyclePct, ageDays } = useMoon()
</script>
