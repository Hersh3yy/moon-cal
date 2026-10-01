<template>
  <BaseCard title="Sun sign">
    <div v-if="sign" class="flex items-center gap-4">
      <ZodiacIcon :sign="sign" />
      <div>
        <p class="font-display text-xl text-moon-50">{{ sign.name }} <span class="text-base text-moon-300" aria-hidden="true">{{ sign.symbol }}</span></p>
        <p class="mt-1 text-sm text-moon-300">{{ sign.sunDescription }}</p>
        <p class="mt-1 text-xs text-muted">{{ sign.sunDates }}</p>
      </div>
    </div>
    <p v-else class="text-sm text-muted">No sign data.</p>
  </BaseCard>
</template>

<script setup lang="ts">
import { zodiacSign } from '~/data/zodiac'

const { zodiac } = useMoon()
const sign = computed(() => zodiacSign(zodiac.value?.sun_sign))
</script>
