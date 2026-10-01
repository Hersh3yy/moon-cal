import { storeToRefs } from 'pinia'
import { useMoonStore } from '~/stores/moon'
import type { PhaseEvent } from '~/types/moon'
import { angularDiameterArcmin, compassPoint, distanceFraction, MOON_DISTANCE, percent } from '~/utils/format'
import { daysFromNow } from '~/utils/dates'

export interface UpcomingPhase {
  key: 'new_moon' | 'first_quarter' | 'full_moon' | 'last_quarter'
  label: string
  event: PhaseEvent
  daysAhead: number
}

const PHASE_LABELS: Record<UpcomingPhase['key'], string> = {
  new_moon: 'New moon',
  first_quarter: 'First quarter',
  full_moon: 'Full moon',
  last_quarter: 'Last quarter',
}

/**
 * Named selectors over the store's raw API JSON, so widgets read `illuminationPct`
 * instead of `moonData?.moon?.detailed?.illumination_details?.percentage`.
 */
export function useMoon() {
  const store = useMoonStore()
  const { moonData, loading, error, coordinates, cityName, locationSource } = storeToRefs(store)

  const moon = computed(() => moonData.value?.moon ?? null)
  const sun = computed(() => moonData.value?.sun ?? null)

  const phaseName = computed(() => moon.value?.phase_name ?? '')
  const stage = computed(() => (moon.value?.stage ?? '').toLowerCase())
  const illuminationPct = computed(() => moon.value?.detailed?.illumination_details?.percentage ?? percent(moon.value?.illumination))
  const cyclePct = computed(() => percent(moon.value?.lunar_cycle))
  const ageDays = computed(() => moon.value?.age_days ?? null)

  const upcoming = computed(() => moon.value?.detailed?.upcoming_phases ?? null)
  const nextFullMoon = computed(() => upcoming.value?.full_moon?.next ?? null)
  const lastFullMoon = computed(() => upcoming.value?.full_moon?.last ?? null)
  const upcomingPhases = computed<UpcomingPhase[]>(() => {
    const u = upcoming.value
    if (!u) return []
    return (Object.keys(PHASE_LABELS) as UpcomingPhase['key'][])
      .map((key) => u[key]?.next && { key, label: PHASE_LABELS[key], event: u[key]!.next!, daysAhead: daysFromNow(u[key]!.next!.timestamp) })
      .filter((p): p is UpcomingPhase => Boolean(p))
      .sort((a, b) => a.event.timestamp - b.event.timestamp)
  })

  // The API reports distances in metres.
  const distanceKm = computed(() => {
    const m = moon.value?.detailed?.position?.distance
    return m ? m / 1000 : null
  })
  const distance = computed(() => {
    const km = distanceKm.value
    if (!km) return null
    const arcmin = angularDiameterArcmin(km)
    return {
      km,
      fraction: distanceFraction(km),
      arcmin,
      vsMeanPct: Math.round(((MOON_DISTANCE.mean - km) / MOON_DISTANCE.mean) * 100),
      isNearPerigee: km < MOON_DISTANCE.perigee + 10_000,
      isNearApogee: km > MOON_DISTANCE.apogee - 10_000,
    }
  })

  const position = computed(() => {
    const p = moon.value?.detailed?.position
    if (!p) return null
    return { altitude: p.altitude, azimuth: p.azimuth, isUp: p.altitude > 0, compass: compassPoint(p.azimuth), parallacticAngle: p.parallactic_angle }
  })

  const visibility = computed(() => moon.value?.detailed?.visibility ?? null)
  const equipment = computed(() => visibility.value?.viewing_conditions?.recommended_equipment ?? null)
  const optimalViewing = computed(() => moon.value?.events?.optimal_viewing_period ?? null)

  const zodiac = computed(() => moon.value?.zodiac ?? null)

  /** One-sentence "tonight" summary for the hero. */
  const tonight = computed(() => {
    const m = moon.value
    if (!m) return ''
    const parts: string[] = []
    const illum = illuminationPct.value
    parts.push(`${m.phase_name}${illum != null ? `, ${Math.round(illum)}% lit` : ''}.`)
    if (position.value?.isUp) parts.push(`Up now, ${Math.round(position.value.altitude)}° above the horizon in the ${position.value.compass}.`)
    else if (m.moonrise) parts.push(`Below the horizon; rises at ${m.moonrise}.`)
    const best = optimalViewing.value?.start_time
    if (best) parts.push(`Best viewing from ${best}.`)
    return parts.join(' ')
  })

  return {
    store,
    moonData,
    loading,
    error,
    coordinates,
    cityName,
    locationSource,
    moon,
    sun,
    phaseName,
    stage,
    illuminationPct,
    cyclePct,
    ageDays,
    upcoming,
    upcomingPhases,
    nextFullMoon,
    lastFullMoon,
    distanceKm,
    distance,
    position,
    visibility,
    equipment,
    optimalViewing,
    zodiac,
    tonight,
  }
}
