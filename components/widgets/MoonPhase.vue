<!-- components/widgets/MoonPhase.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <span class="moon-text-secondary">Current Phase:</span>
                <span class="moon-text-primary">{{ moonData?.moon?.phase_name }}</span>
            </div>
            <p class="text-sm opacity-75 text-right">{{ moonData?.moon?.illumination }} illuminated</p>
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
    mode: 'both',
    colSpan: 1
})

const { moonData } = storeToRefs(useMoonStore())
</script> 