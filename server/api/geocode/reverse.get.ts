import { reversePlace } from '../../utils/geocode'

/** GET /api/geocode/reverse?lat=52.37&lon=4.90 → nearest place name, cached a day per 2-dp coordinate. */
export default defineCachedEventHandler(
  async (event) => {
    const lat = Number(getQuery(event).lat)
    const lon = Number(getQuery(event).lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      throw createError({ statusCode: 400, statusMessage: 'lat and lon must be valid coordinates.' })
    }
    const place = await reversePlace(event, Number(lat.toFixed(2)), Number(lon.toFixed(2)))
    if (!place) throw createError({ statusCode: 404, statusMessage: 'No place name found for these coordinates.' })
    return place
  },
  { name: 'geocode-reverse', maxAge: 60 * 60 * 24, swr: true, getKey: (event) => `${Number(getQuery(event).lat).toFixed(2)}:${Number(getQuery(event).lon).toFixed(2)}` },
)
