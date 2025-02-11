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
                <WidgetsMoonDistance title="Moon Distance" />
                <WidgetsLunarCycle title="Lunar Cycle" />
                <WidgetsNextEclipse title="Next Eclipse" />
                <WidgetsMoonSign title="Moon Sign" />
                <WidgetsSunSign title="Sun Sign" />
                <WidgetsMoonPhase title="Moon Phase" />
                <WidgetsSunTimes title="Sun Times" />
                <WidgetsMoonTimes title="Moon Times" />
                <WidgetsNextFullMoon title="Next Full Moon" />
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