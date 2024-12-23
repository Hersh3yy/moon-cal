import { defineStore } from 'pinia'
import { useCoordinateLookup } from '@/composables/useCoordinateLookup'

export const useMoonStore = defineStore('moon', {
    state: () => ({
        moonData: null,
        loading: false,
        error: null,
        debugInfo: null,
        coordinates: {
            lat: 52.3676,  // Amsterdam default
            lon: 4.9041
        }
    }),

    getters: {
        phase: state => state.moonData?.phase || 0,
        phaseName: state => state.moonData?.phase_name || 'Loading...',
        illumination: state => state.moonData?.illumination || 0,
        ageDays: state => state.moonData?.age_days || 0,
        nextFullMoon: state => state.moonData?.moon_phases?.full_moon?.next || null,
        nextNewMoon: state => state.moonData?.moon_phases?.new_moon?.next || null,
        sun() {
            return this.moonData?.sun || {};
        },
        sunset() {
            return this.sun.sunset || null;
        },
        sunrise() {
            return this.sun.sunrise || null;
        },
    },

    actions: {
        async fetchMoonData() {
            const config = useRuntimeConfig()
            this.loading = true
            this.error = null
            this.debugInfo = null

            const fetchData = async () => {
                try {
                    const url = `https://moon-phase.p.rapidapi.com/advanced?lat=${this.coordinates.lat}&lon=${this.coordinates.lon}`
                    
                    this.debugInfo = {
                        url,
                        apiKey: config.public.moonApiKey || 'Not set',
                        coordinates: this.coordinates
                    }

                    const response = await fetch(url, {
                        headers: {
                            'x-rapidapi-key': config.public.moonApiKey || 'Not Authorized',
                            'x-rapidapi-host': 'moon-phase.p.rapidapi.com'
                        }
                    })

                    if (!response.ok) {
                        const errorText = await response.text()
                        if (response.status === 429) { // Throttle error
                            console.warn('Throttled. Retrying in 1 second...')
                            setTimeout(fetchData, 1000); // Retry after 1 second
                            return;
                        }
                        throw new Error(`API Error (${response.status}): ${errorText}`)
                    }

                    const data = await response.json()
                    this.moonData = data
                    
                    // Add response to debug info
                    this.debugInfo = {
                        ...this.debugInfo,
                        responseStatus: response.status,
                        responseHeaders: Object.fromEntries(response.headers.entries()),
                        data
                    }
                } catch (error) {
                    console.error('Error fetching moon data:', error)
                    this.error = error.message
                    this.debugInfo = {
                        ...this.debugInfo,
                        error: {
                            message: error.message,
                            stack: error.stack
                        }
                    }
                } finally {
                    this.loading = false
                }
            };

            await fetchData(); // Initial fetch
        },

        async getCoordinatesFromCity(city: string) {
            const { fetchCoordinates, coordinates, error } = useCoordinateLookup();
            await fetchCoordinates(city);
            this.debugInfo = {
                ...this.debugInfo,
                coordinatesRequest: city,
                coordinatesResponse: coordinates.value
            };
            if (coordinates.value.lat && coordinates.value.lon) {
                this.coordinates = {
                    lat: coordinates.value.lat,
                    lon: coordinates.value.lon
                };
                await this.fetchMoonData(); // Fetch moon data with new coordinates
            } else {
                this.error = error.value;
            }
        }
    }
});