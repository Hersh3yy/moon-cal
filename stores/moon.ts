import { defineStore } from 'pinia'
import type { Coordinates, LocationSource, MoonData } from '~/types/moon'

const STORAGE_KEY = 'lunatrack:location'
const DEFAULT_LOCATION = { lat: 52.3676, lon: 4.9041, city: 'Amsterdam' }

interface SavedLocation extends Coordinates {
  city: string
  source: LocationSource
  savedAt: number
}

export const useMoonStore = defineStore('moon', {
  state: () => ({
    moonData: null as MoonData | null,
    loading: false,
    error: null as string | null,
    coordinates: { lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon } as Coordinates,
    cityName: DEFAULT_LOCATION.city,
    locationSource: 'default' as LocationSource,
    fetchedAt: null as number | null,
  }),

  getters: {
    hasData: (state) => state.moonData !== null,
    isSouthernHemisphere: (state) => state.coordinates.lat < 0,
  },

  actions: {
    /** Fetch moon + sun data for the current coordinates through the server proxy. */
    async fetchMoonData() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<MoonData>('/api/moon', {
          query: { lat: this.coordinates.lat, lon: this.coordinates.lon },
        })
        this.moonData = data
        this.fetchedAt = Date.now()
      } catch (error: unknown) {
        const message = (error as { statusMessage?: string; data?: { statusMessage?: string } }).data?.statusMessage
          ?? (error as { statusMessage?: string }).statusMessage
          ?? (error instanceof Error ? error.message : 'Could not load moon data.')
        this.error = message
      } finally {
        this.loading = false
      }
    },

    /** Set the location (and remember it in this browser). Call fetchMoonData() afterwards. */
    setLocation({ lat, lon, city, source }: Coordinates & { city: string; source: LocationSource }) {
      this.coordinates = { lat, lon }
      this.cityName = city
      this.locationSource = source
      if (import.meta.client) {
        try {
          const saved: SavedLocation = { lat, lon, city, source, savedAt: Date.now() }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
        } catch {
          /* private mode or storage disabled: fine, we just don't remember */
        }
      }
    },

    /** Restore the last location this browser used. Returns true when something was restored. */
    restoreLocation(): boolean {
      if (!import.meta.client) return false
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return false
        const saved = JSON.parse(raw) as Partial<SavedLocation>
        if (typeof saved.lat !== 'number' || typeof saved.lon !== 'number' || !saved.city) return false
        this.coordinates = { lat: saved.lat, lon: saved.lon }
        this.cityName = saved.city
        this.locationSource = 'saved'
        return true
      } catch {
        return false
      }
    },
  },
})
