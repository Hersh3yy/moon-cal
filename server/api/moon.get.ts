import type { MoonData } from '~/types/moon'

/**
 * GET /api/moon?lat=52.37&lon=4.90
 *
 * Proxies the RapidAPI moon-phase endpoint so the key never reaches the browser.
 * Coordinates are rounded to 2 decimals (~1 km) so the cache key space stays small;
 * responses are cached for 10 minutes per rounded coordinate pair.
 */
export default defineCachedEventHandler(
  async (event) => {
    const { lat, lon } = parseCoordinates(getQuery(event))
    const { moonApiKey } = useRuntimeConfig(event)
    if (!moonApiKey) {
      throw createError({ statusCode: 503, statusMessage: 'Moon data is not configured on this server.' })
    }

    try {
      const data = await $fetch<MoonData>('https://moon-phase.p.rapidapi.com/advanced', {
        query: { lat, lon },
        headers: {
          'x-rapidapi-key': moonApiKey,
          'x-rapidapi-host': 'moon-phase.p.rapidapi.com',
        },
        timeout: 10_000,
      })
      if (!data || typeof data !== 'object' || !data.moon || !data.sun) {
        throw createError({ statusCode: 502, statusMessage: 'Moon data came back in an unexpected shape.' })
      }
      return data
    } catch (error: unknown) {
      const status = (error as { statusCode?: number; status?: number }).statusCode ?? (error as { status?: number }).status
      if (status === 429) throw createError({ statusCode: 429, statusMessage: 'Moon data is rate-limited right now. Try again in a minute.' })
      if (status === 502) throw error
      throw createError({ statusCode: 502, statusMessage: 'Moon data is temporarily unavailable.' })
    }
  },
  {
    name: 'moon',
    maxAge: 60 * 10,
    swr: true,
    getKey: (event) => {
      const { lat, lon } = parseCoordinates(getQuery(event), false)
      return `${lat}:${lon}`
    },
  },
)

function parseCoordinates(query: Record<string, unknown>, strict = true): { lat: string; lon: string } {
  const lat = Number(query.lat)
  const lon = Number(query.lon)
  const valid = Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180
  if (!valid) {
    if (strict) throw createError({ statusCode: 400, statusMessage: 'lat and lon must be valid coordinates.' })
    return { lat: 'invalid', lon: 'invalid' }
  }
  return { lat: lat.toFixed(2), lon: lon.toFixed(2) }
}
