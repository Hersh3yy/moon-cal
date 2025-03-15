<template>
  <div class="relative w-full h-full rounded-full overflow-hidden bg-gray-900 moon-animate">
    <!-- Direct image approach -->
    <img :src="moonImagePath" alt="Moon" class="w-full h-full object-cover" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMoonStore } from '@/stores/moon'

const moonStore = useMoonStore()
const moonData = computed(() => moonStore.moonData)

// Determine the correct moon image based on phase
const moonImagePath = computed(() => {
  if (!moonData.value) return '/images/moon-phase-images/full-moon.png'
  
  const phase = moonData.value.moon.phase_name?.toLowerCase() || 'full moon'
  
  // Map phase name to image file
  const phaseMap = {
    'new moon': 'new-moon',
    'waxing crescent': 'waxing-crescent',
    'first quarter': 'first-quarter',
    'waxing gibbous': 'waxing-gibbous',
    'full moon': 'full-moon',
    'waning gibbous': 'waning-gibbous',
    'last quarter': 'last-quarter',
    'waning crescent': 'waning-crescent'
  }
  
  const imageName = phaseMap[phase] || 'full-moon'
  return `/images/moon-phase-images/${imageName}.png`
})

// Ensure the image is loaded
onMounted(() => {
  // Preload the image
  const img = new Image()
  img.src = moonImagePath.value
})
</script>

<style scoped>
.moon-animate {
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (prefers-reduced-motion: reduce) {
  .moon-animate {
    animation: none;
  }
}
</style> 