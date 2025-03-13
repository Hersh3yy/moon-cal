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
            // First check if we have permission
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
            
            // If permission is denied, we need to explicitly request it
            if (permissionStatus.state === 'denied') {
                error.value = 'Please enable location access in your browser settings'
                return
            }

            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000, // Increased timeout to 10 seconds
                        maximumAge: 0
                    }
                )
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
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    error.value = 'Location access was denied. Please enable it in your browser settings.'
                } else if (err.name === 'TimeoutError') {
                    error.value = 'Location request timed out. Please try again.'
                } else if (err.name === 'PositionUnavailableError') {
                    error.value = 'Location information is unavailable. Please try again.'
                } else {
                    error.value = err.message
                }
            } else {
                error.value = 'Failed to get location'
            }
            throw error.value
        }
    }

    return {
        isSupported,
        error,
        requestLocation
    }
}