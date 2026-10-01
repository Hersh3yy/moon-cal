<template>
  <BaseCard title="Coming up">
    <ol v-if="upcomingPhases.length" class="grid gap-2.5">
      <li v-for="phase in upcomingPhases" :key="phase.key" class="flex items-baseline justify-between gap-3">
        <span class="text-sm text-moon-300">{{ phase.label }}</span>
        <span class="text-right">
          <time :datetime="new Date(phase.event.timestamp * 1000).toISOString()" class="font-display text-sm text-moon-50">{{ formatDate(phase.event.timestamp, { day: 'numeric', month: 'short' }) }}</time>
          <span class="block text-xs text-muted">{{ relativeDays(phase.daysAhead) }}</span>
        </span>
      </li>
    </ol>
    <p v-else class="text-sm text-muted">No phase data.</p>
  </BaseCard>
</template>

<script setup lang="ts">
import { formatDate, relativeDays } from '~/utils/dates'

const { upcomingPhases } = useMoon()
</script>
