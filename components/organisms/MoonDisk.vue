<template>
  <div
    class="moon-disk relative h-full w-full overflow-hidden rounded-full bg-ink-3"
    role="img"
    :aria-label="label"
    :style="{ '--glow': glow }"
  >
    <svg viewBox="0 0 100 100" class="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <mask :id="maskId">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <path :d="shadowPath" fill="black" opacity="0.92" />
        </mask>
      </defs>
      <g :style="{ transform: diskTransform, transformOrigin: 'center' }">
        <image href="/images/moon-phase-images/full-moon.webp" width="100" height="100" preserveAspectRatio="xMidYMid slice" :mask="`url(#${maskId})`" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 0 new → 0.5 full → 1 new */
  phase: number | null
  stage: string
  illumination: number | null
  phaseName: string
  /** Southern-hemisphere viewers see the disc mirrored. */
  mirrored?: boolean
  /** Parallactic angle in degrees: tilts the disc as it appears from the horizon. */
  tilt?: number
}>()

const maskId = useId()

const label = computed(() => `${props.phaseName || 'Moon'}${props.illumination != null ? `, ${Math.round(props.illumination)}% illuminated` : ''}`)
const glow = computed(() => ((props.illumination ?? 50) / 100).toFixed(2))
const diskTransform = computed(() => `${props.mirrored ? 'scale(-1, 1) ' : ''}rotate(${(props.tilt ?? 0).toFixed(1)}deg)`)

// The shadow mask for the current phase.
//
// A moon image is the full-moon sprite with a dark shadow laid over the un-lit part. The
// boundary between lit and dark (the terminator) is a half-ellipse whose horizontal radius
// is |cos(2π·phase)|·R: the full disc width at new and full, zero at the quarters (a straight
// line). `stage` picks the lit side — waxing lights the right, waning the left — for a
// northern-hemisphere viewer; `mirrored` flips it for the south.
const shadowPath = computed(() => {
  const phase = props.phase
  if (phase == null || !Number.isFinite(phase)) return ''
  const R = 50
  const cx = 50
  const EPS = 0.01

  if (phase <= EPS || phase >= 1 - EPS) return 'M 0 0 H 100 V 100 H 0 Z' // new: all dark
  if (Math.abs(phase - 0.5) < EPS) return '' // full: no shadow

  const isWaxing = props.stage.toLowerCase() === 'waxing'
  const cosA = Math.cos(phase * 2 * Math.PI)
  const rx = Math.abs(cosA) * R
  const crescent = cosA > 0 // shadow covers more than half the disc

  if (isWaxing) {
    const sweep = crescent ? 1 : 0
    return `M ${cx} 0 A ${R} ${R} 0 0 0 ${cx} 100 A ${rx} ${R} 0 0 ${sweep} ${cx} 0 Z`
  }
  const sweep = crescent ? 0 : 1
  return `M ${cx} 0 A ${R} ${R} 0 0 1 ${cx} 100 A ${rx} ${R} 0 0 ${sweep} ${cx} 0 Z`
})
</script>

<style scoped>
.moon-disk {
  box-shadow: 0 0 calc(30px + 60px * var(--glow, 0.5)) rgba(223, 230, 255, calc(0.12 + 0.28 * var(--glow, 0.5)));
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .moon-disk {
    animation: none;
  }
}
</style>
