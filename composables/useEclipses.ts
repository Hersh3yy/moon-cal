import type { Coordinates } from '~/types/moon'

export interface LunarEclipse {
  kind: 'penumbral' | 'partial' | 'total'
  peak: Date
  obscuration: number
  /** Altitude of the Moon above the horizon at maximum eclipse, for the given place. */
  altitudeAtPeak: number
  visible: boolean
}

export interface SolarEclipse {
  kind: 'partial' | 'annular' | 'total'
  peak: Date
  /** Fraction of the Sun's disc covered, as seen from the given place. */
  obscuration: number
  altitudeAtPeak: number
  begins: Date
  ends: Date
}

/**
 * Next lunar and solar eclipse, computed locally with astronomy-engine (loaded on demand,
 * client only). The lunar eclipse is global; whether you can see it depends on the Moon
 * being above your horizon at maximum. The solar one is searched for your location, so its
 * obscuration is what you would actually see.
 */
export function useEclipses(coordinates: Ref<Coordinates>) {
  const lunar = ref<LunarEclipse | null>(null)
  const solar = ref<SolarEclipse | null>(null)
  const pending = ref(true)
  const failed = ref(false)

  async function compute() {
    if (!import.meta.client) return
    pending.value = true
    failed.value = false
    try {
      const A = await import('astronomy-engine')
      const now = new Date()
      const observer = new A.Observer(coordinates.value.lat, coordinates.value.lon, 0)

      const le = A.SearchLunarEclipse(now)
      const eq = A.Equator(A.Body.Moon, le.peak, observer, true, true)
      const horizon = A.Horizon(le.peak, observer, eq.ra, eq.dec, 'normal')
      lunar.value = {
        kind: le.kind as LunarEclipse['kind'],
        peak: le.peak.date,
        obscuration: le.obscuration,
        altitudeAtPeak: horizon.altitude,
        visible: horizon.altitude > 0,
      }

      const se = A.SearchLocalSolarEclipse(now, observer)
      solar.value = {
        kind: se.kind as SolarEclipse['kind'],
        peak: se.peak.time.date,
        obscuration: se.obscuration,
        altitudeAtPeak: se.peak.altitude,
        begins: se.partial_begin.time.date,
        ends: se.partial_end.time.date,
      }
    } catch (e) {
      failed.value = true
      console.error('[eclipses] computation failed', e)
    } finally {
      pending.value = false
    }
  }

  watch(() => `${coordinates.value.lat},${coordinates.value.lon}`, compute, { immediate: true })

  return { lunar, solar, pending, failed }
}
