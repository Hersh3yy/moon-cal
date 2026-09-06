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

// The shadow-mask path for the current phase.
//
// A moon image is the full-moon sprite with a dark shadow laid over the
// un-lit part. The boundary between lit and dark (the terminator) is a
// half-ellipse whose horizontal radius tracks the illuminated fraction:
// wide at new/full, zero at the quarters (a straight line). The lit side is
// chosen by `stage` (waxing = right, waning = left), matching the app's
// convention. phase runs 0 (new) → 0.5 (full) → 1 (new).
const getMoonPhaseMask = computed(() => {
  const m = moonData.value?.moon
  if (!m || typeof m.phase !== 'number') return ''

  const phase = m.phase
  const R = 50
  const cx = 50
  const EPS = 0.01

  // New moon (phase near 0 OR near 1) → the whole disc is dark.
  // Full moon (phase near 0.5) → no shadow at all.
  if (phase <= EPS || phase >= 1 - EPS) return 'M 0 0 H 100 V 100 H 0 Z'
  if (Math.abs(phase - 0.5) < EPS) return ''

  const isWaxing = (m.stage || '').toLowerCase() === 'waxing'
  const angle = phase * 2 * Math.PI       // 0..2π
  const cosA = Math.cos(angle)
  const rx = Math.abs(cosA) * R            // terminator x-radius (0 at the quarters)
  const crescent = cosA > 0                // shadow covers more than half the disc

  // Path: start at the top, arc down the dark limb, arc back up the terminator.
  if (isWaxing) {
    // Lit on the right, so the shadow is on the LEFT.
    const termSweep = crescent ? 1 : 0
    return `M ${cx} 0 A ${R} ${R} 0 0 0 ${cx} 100 A ${rx} ${R} 0 0 ${termSweep} ${cx} 0 Z`
  }
  // Waning: lit on the left, shadow on the RIGHT.
  const termSweep = crescent ? 0 : 1
  return `M ${cx} 0 A ${R} ${R} 0 0 1 ${cx} 100 A ${rx} ${R} 0 0 ${termSweep} ${cx} 0 Z`
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