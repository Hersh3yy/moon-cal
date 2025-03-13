<!-- components/LocationSelector.vue -->
<template>
    <div class="relative">
        <!-- Display Mode -->
        <div v-if="!isEditing" class="flex items-center gap-2">
            <div class="flex items-center gap-2 w-fit h-9 bg-zinc-400/10 rounded-lg px-3">
                <img :src="locationIcon" alt="Location" class="w-3 h-5" />
                <span class="text-white text-base font-extralight font-['Helvetica Neue']">
                    {{ moonStore.cityName || cityInput || 'Getting your location...' }}
                </span>
            </div>

            <!-- Location Actions -->
            <div class="flex gap-2">
                <!-- Get Current Location -->
                <button @click="getCurrentLocation" 
                    class="h-9 w-9 bg-zinc-400/10 rounded-lg flex items-center justify-center hover:bg-zinc-400/20"
                    :disabled="!isGeolocationSupported || moonStore.loading">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" 
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                        </path>
                    </svg>
                </button>

                <!-- Edit Location -->
                <button @click="startEditing"
                    class="h-9 w-9 bg-zinc-400/10 rounded-lg flex items-center justify-center hover:bg-zinc-400/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="flex gap-2 items-center">
            <div class="relative flex-1">
                <input type="text" v-model="cityInput"
                    class="w-full h-9 bg-zinc-400/10 rounded-lg px-3 text-base font-extralight font-helvetica text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                    placeholder=" " @keyup.enter="updateLocation" :data-umami-event="`Location changed? ${cityInput}`" />
                <span
                    class="absolute left-3 top-2 text-white/60 text-sm transition-all duration-200 pointer-events-none"
                    :class="[cityInput ? 'transform -translate-y-4 text-xs' : '']">
                    Enter city name
                </span>
            </div>

            <!-- Update Button -->
            <button v-if="showChangeButton" @click="updateLocation"
                class="h-9 px-3 bg-zinc-400/10 rounded-lg text-white text-sm hover:bg-zinc-400/20 transition-colors"
                :disabled="moonStore.loading"
                :data-umami-event="`Location changing from ${cityInput}`">
                {{ moonStore.loading ? 'Updating...' : 'Change Location' }}
            </button>
        </div>

        <!-- Coordinates Display -->
        <div class="mt-2 flex items-center gap-2">
            <span class="text-white font-audiowide text-sm">
                {{ formatCoordinates }}
            </span>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-2 text-red-400 text-sm">
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMoonStore } from '@/stores/moon'
import { useGeolocation } from '@/composables/useGeolocation'
import locationIcon from '~/assets/icons/location-icon.png'

// Store and composables
const moonStore = useMoonStore()
const { isSupported: isGeolocationSupported, error: geolocationError, requestLocation } = useGeolocation()

// State
const isEditing = ref(false)
const cityInput = ref('')
const error = ref('')

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
    error.value = ''
}

async function updateLocation() {
    if (cityInput.value && !moonStore.loading) {
        try {
            error.value = ''
            await moonStore.updateLocation(cityInput.value)

            // Track the location update with Umami
            if (window.umami) {
                window.umami.track('location-updated', { city: cityInput.value });
            }

            isEditing.value = false
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error updating location'
        }
    }
}

async function getCurrentLocation() {
    try {
        error.value = ''
        await requestLocation()
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error getting current location'
    }
}

// Request location on mount if not set
onMounted(async () => {
    if(import.meta.client && isGeolocationSupported.value && !moonStore.cityName) {
        try {
            await requestLocation()
        } catch (err) {
            console.error('Failed to get initial location:', err)
            // Don't show error to user on initial load
        }
    }
})
</script>