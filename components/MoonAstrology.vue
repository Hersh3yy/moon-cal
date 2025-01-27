<!-- components/MoonAstrology.vue -->
<template>
    <div class="space-y-4">
        <div class="moon-card">
            <div class="flex items-center justify-between">
                <span class="moon-text-secondary">Moon Sign:</span>
                <span class="moon-text-primary">{{ moonData?.moon?.zodiac?.moon_sign }}</span>
            </div>
        </div>

        <div class="moon-card">
            <div class="flex items-center justify-between">
                <span class="moon-text-secondary">Sun Sign:</span>
                <span class="moon-text-primary">{{ moonData?.moon?.zodiac?.sun_sign }}</span>
            </div>
        </div>

        <div class="moon-card">
            <div class="flex flex-col gap-2">
                <span class="moon-text-secondary">Current Phase:</span>
                <div class="text-right">
                    <span class="moon-text-primary">{{ moonData?.moon?.phase_name }} {{ moonData?.moon?.emoji }}</span>
                    <p class="text-sm opacity-75">{{ moonData?.moon?.illumination }} illuminated</p>
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
</script>