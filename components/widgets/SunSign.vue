<!-- components/widgets/SunSign.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex items-center justify-between">
            <span class="moon-text-secondary">Sun Sign:</span>
            <span class="moon-text-primary">{{ moonData?.moon?.zodiac?.sun_sign }}</span>
        </div>
    </UiBaseCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMoonStore } from '@/stores/moon'

interface Props {
    title?: string
    mode?: 'science' | 'astrology' | 'both'
    colSpan?: 1 | 2
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'astrology',
    colSpan: 1
})

const { moonData } = storeToRefs(useMoonStore())
</script>