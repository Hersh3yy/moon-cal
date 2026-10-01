<template>
  <BaseCard title="Next full moon" :col-span="2">
    <div v-if="nextFullMoon" class="flex gap-4">
      <FullMoonIcon :kind="kind" />
      <div class="min-w-0 flex-1">
        <p class="font-display text-xl text-moon-50">{{ nextFullMoon.name || 'Full moon' }}</p>
        <p class="text-sm text-moon-300">
          <time :datetime="new Date(nextFullMoon.timestamp * 1000).toISOString()">{{ formatDateTime(nextFullMoon.timestamp) }}</time>
          <span class="text-muted"> · {{ relativeDays(daysFromNow(nextFullMoon.timestamp)) }}</span>
        </p>
        <p v-if="nextFullMoon.description" class="mt-2 text-sm text-moon-300">{{ nextFullMoon.description }}</p>
        <p class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <a v-if="kind" :href="kind.url" class="link inline-flex items-center gap-1" target="_blank" rel="noopener">
            About the {{ nextFullMoon.name }} <AppIcon name="external" :size="14" /><span class="sr-only">(opens in a new tab)</span>
          </a>
        </p>
      </div>
    </div>
    <p v-else class="text-sm text-muted">No upcoming full moon data.</p>
    <template v-if="lastFullMoon" #footer>
      <p class="border-t border-line pt-3 text-sm text-muted">
        Last full moon: <span class="text-moon-300">{{ lastFullMoon.name || 'Full moon' }}</span>, {{ relativeDays(daysFromNow(lastFullMoon.timestamp)) }}.
      </p>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { fullMoonKind } from '~/data/fullMoons'
import { daysFromNow, formatDateTime, relativeDays } from '~/utils/dates'

const { nextFullMoon, lastFullMoon } = useMoon()
const kind = computed(() => fullMoonKind(nextFullMoon.value?.name))
</script>
