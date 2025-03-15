<template>
    <div class="flex flex-col items-center justify-center space-y-6">
        <div v-if="moonData" class="relative flex flex-col items-center w-full">
            <!-- Moon image container -->
            <div class="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 relative rounded-full overflow-hidden
                  shadow-[0_0_50px_rgba(255,255,255,0.2)]
                  transition-transform duration-700 ease-in-out transform hover:scale-105 mb-4">
                <!-- Replaced SVG with TheMoon component -->
                <TheMoon />
            </div>

            <!-- Moon information -->
            <div class="text-center w-full">
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
                    {{ moonData.moon.phase_name }}
                </h2>
                <p class="text-lg text-gray-300">
                    {{ moonData.moon.illumination }} illuminated
                </p>

                <!-- Additional moon information - Viewing conditions -->
                <div v-if="viewingInfo" class="mt-4 text-sm text-gray-400">
                    <p>{{ viewingInfo }}</p>
                    <p v-if="optimalViewingPeriod" class="mt-1">
                        Best viewing: {{ optimalViewingPeriod.start_time }} - {{ optimalViewingPeriod.end_time }}
                    </p>
                </div>
            </div>
        </div>
        <div v-else class="w-48 h-48 md:w-64 md:h-64 animate-pulse bg-white/10 rounded-full">
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import TheMoon from '@/components/TheMoon.vue'

const moonStore = useMoonStore()

const moonData = computed(() => moonStore.moonData)

// Get viewing conditions information
const viewingInfo = computed(() => {
    if (!moonData.value?.moon?.detailed?.visibility?.viewing_conditions?.phase_quality) {
        return null
    }
    return moonData.value.moon.detailed.visibility.viewing_conditions.phase_quality
})

// Get optimal viewing period
const optimalViewingPeriod = computed(() => {
    if (!moonData.value?.moon?.events?.optimal_viewing_period) {
        return null
    }
    return moonData.value.moon.events.optimal_viewing_period
})
</script>

<style scoped>
/* Add a subtle rotation animation on hover */
.moon-image-container:hover {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}
</style>