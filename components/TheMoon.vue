<template>
  <ClientOnly>
    <div class="relative w-full h-full rounded-full overflow-hidden bg-gray-900 moon-animate">
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Moon base (dark side) -->
        <circle cx="50" cy="50" r="50" fill="#1a1a1a" />
        
        <!-- Moon illuminated part -->
        <defs>
          <mask id="moonMask">
            <!-- Dark side (black) -->
            <circle cx="50" cy="50" r="50" fill="black" />
            <!-- Illuminated part (white) -->
            <path :d="getIlluminationPath" fill="white" />
          </mask>
        </defs>
        
        <!-- Illuminated moon surface -->
        <circle 
          cx="50" 
          cy="50" 
          r="50" 
          fill="#ffffff" 
          mask="url(#moonMask)"
        />
      </svg>
    </div>
    <template #fallback>
      <div class="relative w-full h-full rounded-full overflow-hidden bg-gray-900 animate-pulse">
        <div class="w-full h-full bg-white/10"></div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { computed } from 'vue'
import { useMoonStore } from '@/stores/moon'

const moonStore = useMoonStore()
const moonData = computed(() => moonStore.moonData)

// Get illumination percentage from detailed data or fallback to basic data
const illuminationPercentage = computed(() => {
  if (!moonData.value) return 0
  
  // Try to get detailed percentage first
  const detailedPercentage = moonData.value.moon?.detailed?.illumination_details?.percentage
  if (detailedPercentage !== undefined) return detailedPercentage
  
  // Fallback to basic illumination string
  const basicIllumination = moonData.value.moon?.illumination
  if (!basicIllumination) return 0
  
  // Convert "3%" to 3
  return parseFloat(basicIllumination.replace('%', ''))
})

// Calculate the SVG path for the illuminated part
const getIlluminationPath = computed(() => {
  const percentage = illuminationPercentage.value
  if (percentage <= 0) return ''
  if (percentage >= 100) return 'M 0 50 A 50 50 0 1 1 100 50 A 50 50 0 1 1 0 50'
  
  // Calculate the intersection points of the illumination line
  const angle = (percentage / 100) * Math.PI
  const x1 = 50 + 50 * Math.cos(angle)
  const y1 = 50 + 50 * Math.sin(angle)
  const x2 = 50 + 50 * Math.cos(-angle)
  const y2 = 50 + 50 * Math.sin(-angle)
  
  // Create the path
  const largeArcFlag = percentage > 50 ? 1 : 0
  return `M ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} A 50 50 0 ${largeArcFlag} 1 ${x1} ${y1}`
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