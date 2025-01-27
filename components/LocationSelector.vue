<!-- components/LocationSelector.vue -->
<template>
    <div class="relative">
        <!-- Display Mode -->
        <div v-if="!isEditing" class="flex items-center gap-2">
            <div class="flex items-center gap-2 w-fit h-9 bg-zinc-400/10 rounded-lg px-3">
                <img :src="locationIcon" alt="Location" class="w-3 h-5" />
                <span class="text-white text-base font-extralight font-['Helvetica Neue']">
                    {{ moonStore.cityName || cityInput }}
                </span>
            </div>

            <!-- Edit Button -->
            <button @click="startEditing"
                class="h-9 w-9 bg-zinc-400/10 rounded-lg flex items-center justify-center hover:bg-zinc-400/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            </button>
        </div>

        <!-- Edit Mode -->
        <div v-else class="flex gap-2 items-center">
            <div class="relative flex-1">
                <input type="text" v-model="cityInput"
                    class="w-full h-9 bg-zinc-400/10 rounded-lg px-3 text-base font-extralight font-helvetica text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                    placeholder=" " @keyup.enter="updateLocation" />
                <span
                    class="absolute left-3 top-2 text-white/60 text-sm transition-all duration-200 pointer-events-none"
                    :class="[cityInput ? 'transform -translate-y-4 text-xs' : '']">
                    Enter city name
                </span>
            </div>

            <!-- Update Button -->
            <button v-if="showChangeButton" @click="updateLocation"
                class="h-9 px-3 bg-zinc-400/10 rounded-lg text-white text-sm hover:bg-zinc-400/20 transition-colors"
                :disabled="moonStore.loading">
                {{ moonStore.loading ? 'Updating...' : 'Change Location' }}
            </button>
        </div>

        <!-- Coordinates Display -->
        <div class="mt-2 flex items-center gap-2">
            <span class="text-white font-audiowide text-sm">
                {{ formatCoordinates }}
            </span>
            <!-- <div class="w-5 h-1 bg-transparent rounded-full border border-white"></div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMoonStore } from '@/stores/moon'
import locationIcon from '~/assets/icons/location-icon.png'

// Store and state
const moonStore = useMoonStore()
const isEditing = ref(false)
const cityInput = ref('')

// Computed values
const formatCoordinates = computed(() => {
    const lat = moonStore.coordinates.lat
    const lon = moonStore.coordinates.lon
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`
})

const showChangeButton = computed(() => cityInput.value && !moonStore.loading)

// Methods
function startEditing() {
    cityInput.value = moonStore.cityName
    isEditing.value = true
}

async function updateLocation() {
    if (cityInput.value && !moonStore.loading) {
        try {
            await moonStore.updateLocation(cityInput.value)
            isEditing.value = false
        } catch (error) {
            console.error('Error updating location:', error)
        }
    }
}
</script>