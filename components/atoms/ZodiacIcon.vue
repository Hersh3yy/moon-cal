<template>
  <img :src="sign.icon" alt="" width="48" height="48" class="h-12 w-12 shrink-0 object-contain" loading="lazy" decoding="async" />
</template>

<script setup lang="ts">
import type { ZodiacSign } from '~/data/zodiac'

defineProps<{ sign: ZodiacSign }>()
</script>
