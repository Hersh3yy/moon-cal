<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="moon-card-row">
            <span class="moon-text-primary moon-card-text">{{ formatDistance(moonData?.moon?.detailed?.position?.distance) }}</span>
        </div>
    </UiBaseCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMoonStore } from '@/stores/moon'
import type { BaseWidgetProps } from '@/types/widget'

const props = withDefaults(defineProps<BaseWidgetProps>(), {
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