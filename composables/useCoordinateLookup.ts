import { ref } from 'vue'

export const useCoordinateLookup = () => {
    const coordinates = ref({ lat: null, lon: null });
    const error = ref(null);

    const fetchCoordinates = async (city: string) => {
        const config = useRuntimeConfig();
        const apiKey = config.public.geocodeApiKey; // Use the geocode API key from runtime config
        const url = `https://geocode.maps.co/search?q=${encodeURIComponent(city)}&api_key=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch coordinates');
            }
            const data = await response.json();
            if (data.length > 0) {
                coordinates.value = {
                    lat: data[0].lat,
                    lon: data[0].lon
                };
            } else {
                error.value = 'No coordinates found for the specified city.';
            }
        } catch (err) {
            error.value = err.message;
        }
    };

    return {
        coordinates,
        error,
        fetchCoordinates
    };
};