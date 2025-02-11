<!-- components/widgets/NextFullMoon.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <span class="moon-text-secondary">Next Full Moon:</span>
                <span class="moon-text-primary">{{ moonData?.moon_phases?.full_moon?.next?.name }}</span>
            </div>
            <div class="flex items-center gap-4">
                <img 
                    :src="`~/assets/images/moon-types/${moonData?.moon_phases?.full_moon?.next?.name?.toLowerCase().replace(' ', '-')}.png`" 
                    :alt="moonData?.moon_phases?.full_moon?.next?.name"
                    class="w-12 h-12 object-contain"
                />
                <div class="flex flex-col flex-1">
                    <p class="text-sm opacity-75">{{ moonData?.moon_phases?.full_moon?.next?.description }}</p>
                    <p class="text-sm opacity-75 mt-1">
                        {{ new Date(moonData?.moon_phases?.full_moon?.next?.timestamp ? moonData?.moon_phases?.full_moon?.next?.timestamp * 1000 : 0).toLocaleDateString() }}
                    </p>
                </div>
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
    title: 'Next Full Moon',
    mode: 'both',
    colSpan: 2
})

const { moonData } = storeToRefs(useMoonStore())
</script>