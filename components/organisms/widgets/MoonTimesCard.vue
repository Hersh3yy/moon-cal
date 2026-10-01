<template>
  <BaseCard title="Moon today">
    <template #header><AppIcon name="moon" :size="18" class="text-moon-300" /></template>
    <StatList>
      <StatRow label="Rises" :value="moon?.moonrise" />
      <StatRow label="Sets" :value="moon?.moonset" />
      <StatRow label="Right now" :value="positionText" />
      <StatRow v-if="visibility?.best_viewing_time" label="Best view" :value="visibility.best_viewing_time" />
    </StatList>
  </BaseCard>
</template>

<script setup lang="ts">
const { moon, position, visibility } = useMoon()

const positionText = computed(() => {
  const p = position.value
  if (!p) return null
  return p.isUp ? `${Math.round(p.altitude)}° up, ${p.compass}` : 'Below horizon'
})
</script>
