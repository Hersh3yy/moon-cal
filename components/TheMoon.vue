<template>
  <ClientOnly>
    <div class="relative w-full h-full rounded-full overflow-hidden bg-gray-900 moon-animate
                shadow-[0_0_50px_rgba(255,255,255,0.2)]
                transition-transform duration-700 ease-in-out transform hover:scale-105">
      <svg viewBox="0 0 100 100" class="w-full h-full">
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
import { useMoonImage } from '@/composables/useMoonImage'

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
.moon-animate {
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

@media (prefers-reduced-motion: reduce) {
  .moon-animate {
    animation: none;
  }
}
</style> 