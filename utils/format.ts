/** Mean lunar distance and the perigee/apogee extremes, in km. */
export const MOON_DISTANCE = { perigee: 356_400, mean: 384_400, apogee: 406_700 }
export const MOON_RADIUS_KM = 1737.4

export function formatKm(km: number | null | undefined): string {
  if (km == null || !Number.isFinite(km)) return '—'
  return `${Math.round(km).toLocaleString('en-GB')} km`
}

/** 0 at perigee, 1 at apogee (clamped). */
export function distanceFraction(km: number): number {
  const f = (km - MOON_DISTANCE.perigee) / (MOON_DISTANCE.apogee - MOON_DISTANCE.perigee)
  return Math.min(1, Math.max(0, f))
}

/** Apparent diameter of the Moon in arcminutes for a centre distance in km. */
export function angularDiameterArcmin(km: number): number {
  return (2 * Math.atan(MOON_RADIUS_KM / km) * 180) / Math.PI * 60
}

const WINDS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

export function compassPoint(azimuthDegrees: number): string {
  const i = Math.round((((azimuthDegrees % 360) + 360) % 360) / 22.5) % 16
  return WINDS[i]
}

export function formatCoordinates(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`
}

/** "71%" or 71.45 → 71 */
export function percent(value: string | number | null | undefined): number | null {
  if (value == null) return null
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : null
}

export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
