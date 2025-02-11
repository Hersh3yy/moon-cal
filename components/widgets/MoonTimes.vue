<!-- components/widgets/MoonTimes.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="space-y-3">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <div class="w-4 h-4 rounded-full bg-white/90"></div>
                </div>
                <span class="moon-text-primary text-base">Moon</span>
            </div>
            <div class="moon-card-row">
                <span class="text-zinc-400">Rise:</span>
                <span class="text-white">{{ moonStore.moonData?.moon?.moonrise }}</span>
            </div>
            <div class="moon-card-row">
                <span class="text-zinc-400">Set:</span>
                <span class="text-white">{{ moonStore.moonData?.moon?.moonset }}</span>
            </div>
            <div class="moon-card-row">
                <span class="text-zinc-400">Age:</span>
                <span class="text-white">{{ moonStore.moonData?.moon?.age_days }} days</span>
            </div>
        </div>
    </UiBaseCard>
</template>

<script setup lang="ts">
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

const moonStore = useMoonStore()
</script>