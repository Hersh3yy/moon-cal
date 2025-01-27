// composables/useCoordinateLookup.ts
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export const useCoordinateLookup = () => {
    const coordinates = ref({ lat: null, lon: null })
    const error = ref(null)
    // Add displayName ref to store the formatted location name
    const displayName = ref('')

    const fetchCoordinates = async (city: string) => {
        const config = useRuntimeConfig()
        const apiKey = config.public.geocodeApiKey
        const url = `https://geocode.maps.co/search?q=${encodeURIComponent(city)}&api_key=${apiKey}`

        try {
            coordinates.value = { lat: null, lon: null }
            error.value = null
            displayName.value = ''

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            if (data.length > 0) {
                coordinates.value = {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon)
                }

                // Format display name using available data
                displayName.value = formatLocationName(data[0])
            } else {
                throw new Error('No location found for the specified city.')
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An unknown error occurred'
            // Re-throw the error so the caller can handle it
            throw new Error(error.value)
        }
    }

    // Helper function to format location name from API response
    const formatLocationName = (location: any): string => {
        const parts = []

        if (location.display_name) {
            // Split display_name and take relevant parts
            const nameParts = location.display_name.split(',').map(part => part.trim())

            // Usually first part is city/town name
            if (nameParts[0]) parts.push(nameParts[0])

            // Add country if available (usually last part)
            if (nameParts[nameParts.length - 1]) {
                parts.push(nameParts[nameParts.length - 1])
            }
        } else if (location.name) {
            parts.push(location.name)
        }

        return parts.length > 0 ? parts.join(', ') : ''
    }

    return {
        coordinates,
        error,
        displayName,
        fetchCoordinates
    }
}