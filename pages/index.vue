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
                <WidgetsMoonDistance title="Moon Distance from Earth" />
                <WidgetsLunarCycle title="Current Lunar Cycle" />
                <WidgetsMoonSign title="Current Moon Sign" />
                <WidgetsSunSign title="Current Sun Sign" />
                <WidgetsMoonPhase title="Current Moon Phase" />
                <WidgetsSunTimes title="Today's Sun Times" />
                <WidgetsMoonTimes title="Today's Moon Times" />
                <WidgetsNextFullMoon title="Next Full Moon Event" />
                <WidgetsNextEclipse title="Next Lunar Eclipse" />
            </LayoutMainContent>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { useMoonStore } from '@/stores/moon'

const moonStore = useMoonStore()
provide('displayMode', ref('both'))

onMounted(async () => {
    try {
        await moonStore.fetchMoonData()
    } catch (error) {
        console.error('Failed to fetch initial moon data:', error)
    }
})
</script>