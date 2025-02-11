<!-- components/widgets/NextEclipse.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex flex-col gap-2">
            <span class="moon-text-secondary moon-card-text">Next eclipse:</span>
            <div class="text-right">
                <span class="moon-text-primary moon-card-text">{{ moonData?.moon?.next_lunar_eclipse?.type }}</span>
                <p class="text-sm opacity-75">{{ formatDate(moonData?.moon?.next_lunar_eclipse?.datestamp) }}</p>
            </div>
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
    colSpan: 2
})

const { moonData } = storeToRefs(useMoonStore())

const formatDate = (date?: string) => {
    if (!date) return '--'
    return new Date(date).toLocaleDateString()
}
</script> 