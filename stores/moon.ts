import { defineStore } from 'pinia'

export const useMoonStore = defineStore('moon', {
    state: () => ({
        moonData: null,
        loading: false,
        error: null,
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
    },

    actions: {
        async fetchMoonData() {
            const config = useRuntimeConfig()
            this.loading = true
            this.error = null

            try {
                const url = `https://moon-phase.p.rapidapi.com/advanced?lat=${this.coordinates.lat}&lon=${this.coordinates.lon}`

                const { data } = await useFetch(url, {
                    headers: {
                        'x-rapidapi-key': config.public.moonApiKey,
                        'x-rapidapi-host': 'moon-phase.p.rapidapi.com'
                    }
                })

                this.moonData = data.value
            } catch (error) {
                console.error('Error fetching moon data:', error)
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async getUserLocation() {
            try {
                if ('geolocation' in navigator) {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject)
                    })

                    this.coordinates = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    }

                    // Refetch moon data with new coordinates
                    await this.fetchMoonData()
                }
            } catch (error) {
                console.warn('Unable to get user location, using default:', error)
            }
        }
    }
})