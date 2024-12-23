<template>
    <div class="flex flex-col items-center justify-center space-y-6">
        <div v-if="moonData" class="relative">
            <!-- Moon image container with glow effect -->
            <div class="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 relative rounded-full overflow-hidden
                       shadow-[0_0_50px_rgba(255,255,255,0.2)]
                       transition-transform duration-700 ease-in-out transform hover:scale-105">
                <img :src="moonImage" 
                     :alt="moonData.phase_name"
                     class="w-full h-full object-cover"
                     :class="{'animate-pulse': !moonImage}">
            </div>
            
            <!-- Phase information -->
            <div class="text-center mt-6">
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
                    {{ moonData.phase_name }}
                </h2>
                <p class="text-lg text-gray-300">
                    {{ moonData.illumination }}% illuminated
                </p>
            </div>
        </div>
        <div v-else class="w-48 h-48 md:w-64 md:h-64 animate-pulse bg-white/10 rounded-full">
        </div>
    </div>
</template>

<script setup>
const moonStore = useMoonStore()
const { phaseToImage } = useMoonImage()

const moonData = computed(() => moonStore.moonData)
const moonImage = computed(() => {
    if (!moonData.value) return null
    // Convert the phase (0-1) to the corresponding image
    return phaseToImage(moonData.value.phase)
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