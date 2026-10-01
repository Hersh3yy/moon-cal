<template>
  <section class="flex flex-col items-center gap-5 text-center" aria-labelledby="hero-title">
    <div class="relative h-56 w-56 p-3 text-glow-300 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
      <ProgressRing :value="cyclePct" />
      <MoonDisk
        :phase="moon?.phase ?? null"
        :stage="stage"
        :illumination="illuminationPct"
        :phase-name="phaseName"
        :mirrored="store.isSouthernHemisphere"
        :tilt="position?.parallacticAngle"
      />
    </div>

    <div class="space-y-2">
      <h1 id="hero-title" class="font-display text-3xl text-moon-50 sm:text-4xl">
        <span class="sr-only">Moon phase tonight in {{ cityName }}: </span>{{ phaseName }}
      </h1>
      <p class="text-lg text-moon-300">
        <span class="font-display text-moon-50">{{ illuminationText }}</span> illuminated
        <template v-if="ageDays != null"> · day {{ ageDays }} of the cycle</template>
      </p>
    </div>

    <TonightSummary :text="tonight" />
  </section>
</template>

<script setup lang="ts">
const { store, moon, phaseName, stage, illuminationPct, cyclePct, ageDays, position, cityName, tonight } = useMoon()

const illuminationText = computed(() => (illuminationPct.value != null ? `${Math.round(illuminationPct.value)}%` : '—'))
</script>
