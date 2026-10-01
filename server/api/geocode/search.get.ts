import { searchPlace } from '../../utils/geocode'

/** GET /api/geocode/search?q=Lisbon → first matching place, cached a day per query. */
export default defineCachedEventHandler(
  async (event) => {
    const q = String(getQuery(event).q ?? '').trim().slice(0, 120)
    if (q.length < 2) throw createError({ statusCode: 400, statusMessage: 'Type at least two characters.' })
    const place = await searchPlace(event, q)
    if (!place) throw createError({ statusCode: 404, statusMessage: `No place found for “${q}”.` })
    return place
  },
  { name: 'geocode-search', maxAge: 60 * 60 * 24, swr: true, getKey: (event) => String(getQuery(event).q ?? '').trim().toLowerCase().slice(0, 120) },
)
