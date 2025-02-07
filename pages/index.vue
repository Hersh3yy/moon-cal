<!-- pages/index.vue -->
<template>
    <div class="w-full">
        <main class="px-4 py-8">
            <!-- Date and Location -->
            <div class="text-center mb-8">
                <h2 class="text-lg font-poppins">{{ currentDate }}</h2>
                <LocationSelector class="mt-4" />
            </div>

            <!-- Error State -->
            <div v-if="moonStore.error" class="text-red-500 text-center py-4">
                {{ moonStore.error }}
            </div>

            <!-- Loading State -->
            <div v-else-if="moonStore.loading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>

            <!-- Content Area -->
            <div v-else-if="moonStore.moonData" class="space-y-8">
                <!-- Moon Display (Always Centered) -->
                <div class="flex justify-center">
                    <MoonDisplay />
                </div>

                <!-- Widget Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Always Visible Widgets -->
                    <WidgetsMoonDistance title="Moon Distance" />
                    <WidgetsLunarCycle title="Lunar Cycle" />
                    <WidgetsNextEclipse title="Next Eclipse" />
                    <WidgetsMoonSign title="Moon Sign" />
                    <WidgetsSunSign title="Sun Sign" />
                    <WidgetsMoonPhase title="Moon Phase" />
                    <WidgetsSunTimes title="Sun Times" />
                    <WidgetsMoonTimes title="Moon Times" />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue'
import { useMoonStore } from '@/stores/moon'

const moonStore = useMoonStore()
provide('displayMode', ref('both'))

const currentDate = computed(() => {
    return new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
})

onMounted(async () => {
    try {
        await moonStore.fetchMoonData()
    } catch (error) {
        console.error('Failed to fetch initial moon data:', error)
    }
})
</script>