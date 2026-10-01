<template>
  <BaseCard title="Sun today">
    <template #header><AppIcon name="sun" :size="18" class="text-yellow-200" /></template>
    <StatList>
      <StatRow label="Rises" :value="sun?.sunrise_timestamp" />
      <StatRow label="Sets" :value="sun?.sunset_timestamp" />
      <StatRow label="Solar noon" :value="sun?.solar_noon" />
      <StatRow label="Day length" :value="dayLength" />
    </StatList>
  </BaseCard>
</template>

<script setup lang="ts">
const { sun } = useMoon()

const dayLength = computed(() => {
  const raw = sun.value?.day_length
  if (!raw) return null
  const [h, m] = raw.split(':')
  return h && m ? `${Number(h)} h ${Number(m)} min` : raw
})
</script>
