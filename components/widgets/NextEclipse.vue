<!-- components/widgets/NextEclipse.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex flex-col gap-2">
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
import type { BaseWidgetProps } from '@/types/widget'

const props = withDefaults(defineProps<BaseWidgetProps>(), {
    mode: 'science',
    colSpan: 1
})

const { moonData } = storeToRefs(useMoonStore())

const formatDate = (date?: string) => {
    if (!date) return '--'
    return new Date(date).toLocaleDateString()
}
</script> 