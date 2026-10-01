import { useMoonStore } from '~/stores/moon'

interface Place {
  lat: number
  lon: number
  city: string
  country: string
}

type PermissionResult = PermissionState | 'unknown'

/**
 * Everything that changes the location: browser geolocation (with the permission flow
 * done right) and city search. Both go through the server proxies, never a third party directly.
 */
export function useLocation() {
  const store = useMoonStore()
  const busy = ref(false)
  const error = ref<string | null>(null)
  const supported = computed(() => import.meta.client && typeof navigator !== 'undefined' && 'geolocation' in navigator)

  async function permissionState(): Promise<PermissionResult> {
    if (!import.meta.client || !('permissions' in navigator)) return 'unknown'
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      return status.state
    } catch {
      return 'unknown' // Safari < 16 and some WebViews
    }
  }

  function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options))
  }

  /**
   * Use the browser's location. Called straight from a click handler so Safari still
   * counts it as user-initiated (no awaits before getCurrentPosition). A quick low-accuracy
   * fix first (works on laptops, no GPS warm-up); a high-accuracy retry only on timeout.
   */
  async function locate(): Promise<boolean> {
    if (!supported.value) {
      error.value = 'Your browser does not support location. Search for a city instead.'
      return false
    }
    busy.value = true
    error.value = null
    try {
      let position: GeolocationPosition
      try {
        position = await getPosition({ enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 })
      } catch (first) {
        if ((first as GeolocationPositionError).code === 3) {
          position = await getPosition({ enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 })
        } else {
          throw first
        }
      }
      const { latitude: lat, longitude: lon } = position.coords
      store.setLocation({ lat, lon, city: 'Your location', source: 'gps' })
      await store.fetchMoonData()
      try {
        const place = await $fetch<Place>('/api/geocode/reverse', { query: { lat, lon } })
        if (place?.city) store.setLocation({ lat, lon, city: place.city, source: 'gps' })
      } catch {
        /* a nameless location is still a correct one */
      }
      return true
    } catch (e) {
      error.value = describeGeolocationError(e)
      return false
    } finally {
      busy.value = false
    }
  }

  /** Look a city up and switch to it. */
  async function search(query: string): Promise<boolean> {
    const q = query.trim()
    if (q.length < 2) {
      error.value = 'Type a city name.'
      return false
    }
    busy.value = true
    error.value = null
    try {
      const place = await $fetch<Place>('/api/geocode/search', { query: { q } })
      store.setLocation({ lat: place.lat, lon: place.lon, city: place.city || q, source: 'search' })
      await store.fetchMoonData()
      return true
    } catch (e: unknown) {
      const status = (e as { statusCode?: number }).statusCode
      error.value = status === 404 ? `No place found for “${q}”. Try the nearest big city.` : 'Could not look that place up right now.'
      return false
    } finally {
      busy.value = false
    }
  }

  return { supported, busy, error, permissionState, locate, search }
}

/** GeolocationPositionError is not an Error: it has a numeric `code`, no `name`. */
export function describeGeolocationError(e: unknown): string {
  const code = (e as { code?: number } | null)?.code
  switch (code) {
    case 1:
      return 'Location access was denied. Allow it for this site in your browser settings, or search for a city.'
    case 2:
      return 'Your position could not be determined. Try again, or search for a city.'
    case 3:
      return 'Finding your position took too long. Try again, or search for a city.'
    default:
      return 'Could not get your location. Search for a city instead.'
  }
}
