<template>
    <div class="relative w-96 h-96 mx-auto">
        <!-- Moon container with subtle glow effect -->
        <div class="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
        <img :src="`/images/moon-images/${currentMoonImage}`" :alt="currentPhase"
            class="absolute inset-0 w-full h-full object-contain transform transition-transform duration-1000 hover:scale-110" />
    </div>
</template>

<script setup>
const { moonStore } = useStore()

// This would be a computed property that returns the correct image based on the phase
const currentMoonImage = computed(() => {
    const phase = moonStore.phase // This should be a number between 0 and 1
    return getMoonImageForPhase(phase)
})

const currentPhase = computed(() => moonStore.currentPhase)

function getMoonImageForPhase(phase) {
    // Map the phase number to the corresponding image
    if (phase <= 0.125) return 'new-moon.png'
    if (phase <= 0.25) return 'waxing-crescent.png'
    if (phase <= 0.375) return 'first-quarter.png'
    if (phase <= 0.625) return 'waxing-gibbous.png'
    if (phase <= 0.75) return 'full-moon.png'
    if (phase <= 0.875) return 'waning-gibbous.png'
    if (phase <= 0.975) return 'last-quarter.png'
    return 'waning-crescent.png'
}
</script>