<!-- components/MoonScience.vue -->
<template>
    <div class="space-y-4">
        <div class="moon-card">
            <div class="flex items-center justify-between">
                <span class="moon-text-secondary">Distance:</span>
                <span class="moon-text-primary">{{ formatDistance(moonData?.moon?.moon_distance) }}</span>
            </div>
        </div>

        <div class="moon-card">
            <div class="flex items-center justify-between">
                <span class="moon-text-secondary">Lunar cycle:</span>
                <span class="moon-text-primary">{{ moonData?.moon?.lunar_cycle }}</span>
            </div>
        </div>

        <div class="moon-card">
            <div class="flex flex-col gap-2">
                <span class="moon-text-secondary">Next eclipse:</span>
                <div class="text-right">
                    <span class="moon-text-primary">{{ moonData?.moon?.next_lunar_eclipse?.type }}</span>
                    <p class="text-sm opacity-75">{{ formatDate(moonData?.moon?.next_lunar_eclipse?.datestamp) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useMoonStore } from '@/stores/moon'

const store = useMoonStore()
const { moonData } = storeToRefs(store)

const formatDistance = (distance) => {
    if (!distance) return '--'
    return `${Math.round(distance).toLocaleString()}km`
}

const formatDate = (date) => {
    if (!date) return '--'
    return new Date(date).toLocaleDateString()
}
</script>