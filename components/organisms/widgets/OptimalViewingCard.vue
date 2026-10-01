<template>
  <BaseCard title="Best viewing tonight" :col-span="2">
    <div v-if="optimalViewing" class="grid gap-5 sm:grid-cols-2">
      <StatList>
        <StatRow label="Window" :value="`${optimalViewing.start_time} – ${optimalViewing.end_time}`" />
        <StatRow label="Duration" :value="`${optimalViewing.duration_hours} h`" />
        <StatRow v-if="visibility?.visibility_rating" label="Conditions" :value="visibility.visibility_rating" />
      </StatList>
      <div class="text-sm text-moon-300">
        <p>{{ optimalViewing.viewing_quality }}</p>
        <ul v-if="optimalViewing.recommendations?.length" class="mt-2 list-disc space-y-1 pl-5">
          <li v-for="tip in optimalViewing.recommendations" :key="tip">{{ tip }}</li>
        </ul>
      </div>
    </div>
    <p v-else class="text-sm text-muted">No good viewing window tonight.</p>
    <template v-if="equipment" #footer>
      <p class="border-t border-line pt-3 text-sm text-muted">
        <span class="text-moon-300">Observer's kit:</span>
        {{ [equipment.telescope, equipment.best_magnification, equipment.filters].filter(Boolean).join(' · ') }}
      </p>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
const { optimalViewing, visibility, equipment } = useMoon()
</script>
