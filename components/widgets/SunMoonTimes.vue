<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="grid grid-cols-2 gap-4">
            <!-- Sun Times -->
            <div class="space-y-3">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-full bg-yellow-400"></div>
                    </div>
                    <span class="text-white font-medium">Sun</span>
                </div>
                <div class="moon-card-row">
                    <span class="text-zinc-400">Rise:</span>
                    <span class="text-white">{{ moonStore.moonData?.sun?.sunrise_timestamp }}</span>
                </div>
                <div class="moon-card-row">
                    <span class="text-zinc-400">Set:</span>
                    <span class="text-white">{{ moonStore.moonData?.sun?.sunset_timestamp }}</span>
                </div>
                <div class="moon-card-row">
                    <span class="text-zinc-400">Day length:</span>
                    <span class="text-white">{{ moonStore.moonData?.sun?.day_length }}</span>
                </div>
            </div>

            <!-- Moon Times -->
            <div class="space-y-3">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-full bg-white/90"></div>
                    </div>
                    <span class="text-white font-medium">Moon</span>
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
                <div v-if="moonStore.moonData?.moon?.detailed?.visibility?.best_viewing_time" class="moon-card-row">
                    <span class="text-zinc-400">Best view:</span>
                    <span class="text-white">{{ moonStore.moonData?.moon?.detailed?.visibility?.best_viewing_time }}</span>
                </div>
            </div>
        </div>
    </UiBaseCard>
</template>

<script setup lang="ts">
import { useMoonStore } from '@/stores/moon'
import type { BaseWidgetProps } from '@/types/widget'

const props = withDefaults(defineProps<BaseWidgetProps>(), {
    mode: 'both',
    colSpan: 2
})

const moonStore = useMoonStore()
</script> 