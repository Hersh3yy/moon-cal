<template>
  <div class="flex flex-col gap-8">
    <LocationBar />

    <ErrorNotice v-if="error" :message="error">
      <button type="button" class="link mt-2 text-sm" @click="store.fetchMoonData()">Try again</button>
    </ErrorNotice>
    <HeroSkeleton v-else-if="!moonData" />

    <template v-if="moonData">
      <MoonHero />
      <WidgetGrid>
        <MoonPhaseCard />
        <MoonTimesCard />
        <SunTimesCard />
        <NextFullMoonCard />
        <UpcomingPhasesCard />
        <MoonDistanceCard />
        <MoonSignCard />
        <SunSignCard />
        <OptimalViewingCard />
        <NextEclipseCard />
      </WidgetGrid>
    </template>
  </div>
</template>

<script setup lang="ts">
const { store, moonData, loading, error } = useMoon()
const { permissionState, locate } = useLocation()

useSeo({
  title: 'Moon phase tonight',
  description: "Tonight's moon for your location: phase and illumination, moonrise and moonset, moon sign, the next full moon and the best time to look up.",
})

onMounted(async () => {
  // Remembered location first; otherwise use the device's position if the site already
  // has permission (no prompt); otherwise the default city.
  const restored = store.restoreLocation()
  if (!restored && (await permissionState()) === 'granted') {
    if (await locate()) return
  }
  await store.fetchMoonData()
})
</script>
