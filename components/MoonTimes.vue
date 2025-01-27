<!-- components/MoonTimes.vue -->
<template>
    <div v-if="moonStore.moonData" class="moon-card">
        <h3 class="moon-text-secondary mb-4">Sunrise & Moonrise</h3>

        <div class="grid grid-cols-2 gap-4">
            <!-- Sun Times -->
            <div class="space-y-2">
                <div class="flex items-center justify-start gap-2">
                    <div class="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-full bg-yellow-400"></div>
                    </div>
                    <span class="moon-text-primary text-base">Sun</span>
                </div>
                <div class="space-y-1">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-poppins text-white/70">Rise:</span>
                        <span class="text-xs font-poppins">{{ formatTime(moonStore.moonData?.sun?.sunrise_timestamp)
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-poppins text-white/70">Set:</span>
                        <span class="text-xs font-poppins">{{ formatTime(moonStore.moonData?.sun?.sunset_timestamp)
                            }}</span>
                    </div>
                </div>
            </div>

            <!-- Moon Times -->
            <div class="space-y-2">
                <div class="flex items-center justify-start gap-2">
                    <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-full bg-white/90"></div>
                    </div>
                    <span class="moon-text-primary text-base">Moon</span>
                </div>
                <div class="space-y-1">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-poppins text-white/70">Rise:</span>
                        <span class="text-xs font-poppins">{{ formatTime(moonStore.moonData?.moon?.moonrise) }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-poppins text-white/70">Set:</span>
                        <span class="text-xs font-poppins">{{ formatTime(moonStore.moonData?.moon?.moonset) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Day Length -->
        <div class="mt-4 pt-4 border-t border-white/10">
            <div class="flex justify-between items-center">
                <span class="text-sm font-poppins text-white/70">Day length:</span>
                <span class="text-sm font-poppins">{{ moonStore.moonData?.sun?.day_length || '--:--' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMoonStore } from '@/stores/moon'

const moonStore = useMoonStore()

function formatTime(timestamp?: string) {
    if (!timestamp) return '--:--'
    return timestamp
}
</script>

<style scoped>
@keyframes glow {

    0%,
    100% {
        opacity: 0.8;
    }

    50% {
        opacity: 1;
    }
}

.sun-icon,
.moon-icon {
    animation: glow 4s ease-in-out infinite;
}
</style>