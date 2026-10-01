import type { H3Event } from 'h3'

export interface Place {
  lat: number
  lon: number
  city: string
  country: string
  displayName: string
}

interface GeocodeHit {
  lat: string
  lon: string
  display_name?: string
  name?: string
  address?: Record<string, string>
}

const BASE = 'https://geocode.maps.co'

function requireKey(event: H3Event): string {
  const { geocodeApiKey } = useRuntimeConfig(event)
  if (!geocodeApiKey) throw createError({ statusCode: 503, statusMessage: 'Location search is not configured on this server.' })
  return geocodeApiKey
}

/** Pick the most useful locality name out of a Nominatim-style address object. */
export function placeName(hit: GeocodeHit): { city: string; country: string } {
  const a = hit.address ?? {}
  const city = a.city || a.town || a.village || a.municipality || a.hamlet || a.suburb || a.county || a.state || hit.name || firstPart(hit.display_name) || ''
  const country = a.country || lastPart(hit.display_name) || ''
  return { city, country }
}

function firstPart(s?: string): string { return s ? s.split(',')[0].trim() : '' }
function lastPart(s?: string): string { return s ? s.split(',').pop()!.trim() : '' }

function toPlace(hit: GeocodeHit): Place {
  const { city, country } = placeName(hit)
  return {
    lat: parseFloat(hit.lat),
    lon: parseFloat(hit.lon),
    city,
    country,
    displayName: hit.display_name ?? city,
  }
}

export async function searchPlace(event: H3Event, q: string): Promise<Place | null> {
  const hits = await $fetch<GeocodeHit[]>(`${BASE}/search`, {
    query: { q, 'accept-language': 'en', api_key: requireKey(event) },
    timeout: 10_000,
  })
  if (!Array.isArray(hits) || hits.length === 0) return null
  return toPlace(hits[0])
}

export async function reversePlace(event: H3Event, lat: number, lon: number): Promise<Place | null> {
  const hit = await $fetch<GeocodeHit>(`${BASE}/reverse`, {
    query: { lat, lon, 'accept-language': 'en', api_key: requireKey(event) },
    timeout: 10_000,
  })
  if (!hit || !hit.lat) return null
  return toPlace(hit)
}
