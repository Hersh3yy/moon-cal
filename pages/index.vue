<!-- pages/index.vue -->
<template>
    <div class="w-full">
        <main class="container mx-auto px-4 py-8">
            <LayoutHeader />
            
            <LayoutErrorMessage 
                v-if="moonStore.error" 
                :message="moonStore.error" 
            />

            <LayoutLoadingSpinner v-else-if="moonStore.loading" />

            <LayoutMainContent v-else-if="moonStore.moonData">
                <WidgetsNextFullMoon title="Next Full Moon" />
                <WidgetsMoonDistance title="Moon Distance from Earth" />
                <WidgetsLunarCycle title="Current Lunar Cycle" />
                <WidgetsMoonSign title="Current Moon Sign" />
                <WidgetsSunSign title="Current Sun Sign" />
                <WidgetsMoonPhase title="Current Moon Phase" />
                <WidgetsOptimalViewing title="Optimal Moon Viewing Period" />
                <WidgetsSunTimes title="Today's Sun Times" />
                <WidgetsMoonTimes title="Today's Moon Times" />
                <WidgetsNextEclipse title="Next Lunar Eclipse" />
            </LayoutMainContent>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { useMoonStore } from '@/stores/moon'
import { useSeo } from '@/composables/useSeo'

const moonStore = useMoonStore()
provide('displayMode', ref('both'))

// Add SEO configuration
useSeo({
  title: 'Lunatrack - Your Complete Lunar Guide',
  description: 'Track moon phases, distances, signs, and more with real-time lunar data. Get accurate information about moon cycles, eclipses, and celestial events.',
  type: 'website',
  keywords: [
    'moon phases',
    'lunar calendar',
    'moon distance',
    'moon signs',
    'celestial events',
    'lunar cycle',
    'full moon dates',
    'lunar eclipse',
    'moon tracking',
    'astronomical data'
  ],
  author: 'Lunatrack'
})

// Add structured data for the moon information
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'Moon Data and Celestial Events',
          description: 'Real-time lunar data including moon phases, distances, signs, and upcoming celestial events',
          keywords: ['moon phase', 'lunar cycle', 'moon distance', 'moon sign', 'sun sign', 'lunar eclipse', 'full moon'],
          temporalCoverage: new Date().toISOString(),
          spatialCoverage: {
            '@type': 'Place',
            name: 'Earth'
          },
          variableMeasured: [
            'Moon Distance',
            'Lunar Cycle',
            'Moon Sign',
            'Sun Sign',
            'Moon Phase',
            'Sun Times',
            'Moon Times',
            'Next Full Moon',
            'Next Eclipse'
          ]
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Lunatrack',
          applicationCategory: 'Astronomy Tool',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          description: 'A comprehensive lunar tracking application providing real-time moon data, phases, and celestial events.',
          browserRequirements: 'Requires JavaScript. Compatible with all modern browsers.',
          softwareVersion: '1.0'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://lunatrack.info'
          }]
        }
      ])
    }
  ]
})

onMounted(async () => {
    try {
        await moonStore.fetchMoonData()
    } catch (error) {
        console.error('Failed to fetch initial moon data:', error)
    }
})
</script>