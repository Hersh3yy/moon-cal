<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="moon-card-row">
            <span class="moon-text-secondary moon-card-text font-poppins">Distance:</span>
            <span class="moon-text-primary moon-card-text">{{ formatDistance(moonData?.moon?.moon_distance) }}</span>
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
    mode: 'science',
    colSpan: 1
})

const { moonData } = storeToRefs(useMoonStore())

const formatDistance = (distance?: number) => {
    if (!distance) return '--'
    return `${Math.round(distance).toLocaleString()}km`
}

// moon distance range: 360,000km - 405,000km
</script>