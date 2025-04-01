<template>
  <ClientOnly>
    <div class="relative w-full h-full rounded-full overflow-hidden bg-gray-900 moon-animate">
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <defs>
          <!-- Create a semi-transparent black color for the shadow -->
          <linearGradient id="shadowGradient">
            <stop offset="0%" stop-color="rgba(0,0,0,0.9)" />
          </linearGradient>
          
          <mask id="moon-phase-mask">
            <!-- Base white background -->
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <!-- Semi-transparent dark mask for the shadow -->
            <path :d="getMoonPhaseMask" fill="black" opacity="0.9" />
          </mask>
        </defs>

        <!-- Moon surface with mask -->
        <g :style="{ transform: `rotate(${moonRotation}deg)`, transformOrigin: 'center' }">
          <image 
            href="/images/moon-phase-images/full-moon.png" 
            width="100" 
            height="100"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#moon-phase-mask)"
          />
        </g>
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

// Calculate moon rotation based on parallactic angle
const moonRotation = computed(() => {
  if (!moonData.value?.moon?.detailed?.position?.parallactic_angle) return 0
  return moonData.value.moon.detailed.position.parallactic_angle
})

// Calculate the mask path for the current phase
const getMoonPhaseMask = computed(() => {
  if (!moonData.value) return ''
  
  const phase = moonData.value.moon.phase // 0 to 1
  const isWaxing = moonData.value.moon.stage === 'waxing'
  
  // For a completely dark or full moon
  if (phase <= 0) return 'M 0 0 H 100 V 100 H 0 Z'  // Full black mask
  if (phase >= 1) return ''  // No mask
  
  const centerX = 50
  const centerY = 50
  const radius = 50
  
  // Calculate the terminator curve
  const angle = phase * Math.PI
  const curveX = centerX + radius * Math.cos(angle)
  
  // For waxing moon (illuminated on right)
  if (isWaxing) {
    return `
      M ${curveX} 0
      A ${radius} ${radius} 0 0 0 ${curveX} 100
      L 0 100
      L 0 0
      Z
    `.trim()
  }
  
  // For waning moon (illuminated on left)
  return `
    M ${curveX} 0
    A ${radius} ${radius} 0 0 1 ${curveX} 100
    L 100 100
    L 100 0
    Z
  `.trim()
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