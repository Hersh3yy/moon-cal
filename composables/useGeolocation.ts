import { ref } from 'vue'
import { useMoonStore } from '@/stores/moon'

export const useGeolocation = () => {
    // Use import.meta.client to check if we're on the client side
    const isSupported = ref(import.meta.client && 'geolocation' in navigator)
    const error = ref<string | null>(null)
    const moonStore = useMoonStore()

    const requestLocation = async () => {
        // Double check we're on client side and geolocation is supported
        if (!import.meta.client || !isSupported.value) {
            error.value = 'Geolocation is not supported by your browser'
            return
        }

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                })
            })

            const { latitude, longitude } = position.coords

            // Update the moon store with the new coordinates
            moonStore.coordinates = {
                lat: latitude,
                lon: longitude
            }

            // Fetch new moon data with updated coordinates
            await moonStore.fetchMoonData()

            return { latitude, longitude }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to get location'
            throw error.value
        }
    }

    return {
        isSupported,
        error,
        requestLocation
    }
}