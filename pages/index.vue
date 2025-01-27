<!-- pages/index.vue -->
<template>
    <div class="w-full">
        <main class="px-4 py-8">
            <!-- Date and Location -->
            <div class="text-center mb-8">
                <h2 class="text-lg font-poppins">{{ currentDate }}</h2>
                <LocationSelector class="mt-4" />
            </div>

            <!-- Display Mode Toggle -->
            <ModeToggle v-model:mode="displayMode" />

            <!-- Error State -->
            <div v-if="moonStore.error" class="text-red-500 text-center py-4">
                {{ moonStore.error }}
            </div>

            <!-- Loading State -->
            <div v-else-if="moonStore.loading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>

            <!-- Content Grid -->
            <div v-else-if="moonStore.moonData" class="md:grid md:grid-cols-12 md:gap-8">
                <!-- Left Column -->
                <div class="hidden md:block md:col-span-3 space-y-4">
                    <MoonScience v-if="displayMode === 'science'" />
                    <MoonAstrology v-else />
                </div>

                <!-- Center Column -->
                <div class="md:col-span-6">
                    <MoonDisplay />

                    <!-- Phase Cards -->
                    <div class="space-y-4 mt-8">
                        <div class="moon-card">
                            <div class="flex items-center justify-between">
                                <span class="moon-text-secondary">Phase:</span>
                                <span class="moon-text-primary">
                                    {{ moonStore.moonData?.moon.phase_name }}
                                    {{ moonStore.emoji }}
                                </span>
                            </div>
                        </div>

                        <div class="moon-card">
                            <div class="flex items-center justify-between">
                                <span class="moon-text-secondary">Next full moon in:</span>
                                <span class="moon-text-primary">{{ formatCountdown }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="md:col-span-3 mt-8 md:mt-0 space-y-4">
                    <MoonTimes />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMoonStore } from '@/stores/moon'

const moonStore = useMoonStore()
const displayMode = ref('science')

const currentDate = computed(() => {
    return new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
})

const formatCountdown = computed(() => {
    const nextFull = moonStore.moonData?.moon_phases?.full_moon?.next
    if (!nextFull) return 'Loading...'

    const days = nextFull.days_ahead || 0
    const hours = nextFull.hours || 0
    const minutes = nextFull.minutes || 0

    return `${days}d, ${hours}h, ${minutes}m`
})

onMounted(async () => {
    try {
        await moonStore.fetchMoonData()
    } catch (error) {
        console.error('Failed to fetch initial moon data:', error)
    }
})
</script>