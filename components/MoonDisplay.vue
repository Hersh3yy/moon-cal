# components/MoonDisplay.vue

<template>
    <div class="flex flex-col items-center justify-center space-y-6">
        <div v-if="moonData" class="relative">
            <!-- Moon image container with mask -->
            <div class="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 relative rounded-full overflow-hidden
                  shadow-[0_0_50px_rgba(255,255,255,0.2)]
                  transition-transform duration-700 ease-in-out transform hover:scale-105">
                <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full">
                    <defs>
                        <mask id="moon-phase-mask">
                            <rect x="0" y="0" width="100" height="100" fill="white" />
                            <path :d="phaseMaskPath" fill="black" />
                        </mask>
                    </defs>

                    <!-- Full moon image with mask and rotation -->
                    <g :style="{ transform: `rotate(${moonRotation}deg)`, transformOrigin: 'center' }">
                        <image href="/images/moon-phase-images/full-moon.png" width="100" height="100"
                            preserveAspectRatio="xMidYMid slice" mask="url(#moon-phase-mask)" />
                    </g>
                </svg>
            </div>

            <!-- Moon information -->
            <div class="text-center mt-6">
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
                    {{ moonData.moon.phase_name }}
                </h2>
                <p class="text-lg text-gray-300">
                    {{ moonData.moon.illumination }} illuminated
                </p>

                <!-- Additional moon information -->
                <div class="mt-4 text-sm text-gray-400">
                    <p>{{ cycleInfo.sidereal.effect }}</p>
                    <p class="mt-1">{{ cycleInfo.tropical.effect }}</p>
                </div>
            </div>
        </div>
        <div v-else class="w-48 h-48 md:w-64 md:h-64 animate-pulse bg-white/10 rounded-full">
        </div>
    </div>
</template>

<script setup>
const moonStore = useMoonStore()
const { getMoonPhaseMask, getMoonCycleInfo } = useMoonImage()

const moonData = computed(() => moonStore.moonData)

// Calculate the mask path for the current phase
const phaseMaskPath = computed(() => {
    if (!moonData.value) return ''
    return getMoonPhaseMask(
        moonData.value.moon.phase,
        moonData.value.moon.illumination,
        moonData.value.moon.stage
    )
})

// Calculate moon rotation based on parallactic angle
const moonRotation = computed(() => {
    if (!moonData.value?.moon?.detailed?.position?.parallactic_angle) return 0
    return moonData.value.moon.detailed.position.parallactic_angle
})

// Get additional cycle information
const cycleInfo = computed(() => {
    if (!moonData.value) return {
        sidereal: { effect: '' },
        tropical: { effect: '' }
    }
    return getMoonCycleInfo(moonData.value)
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