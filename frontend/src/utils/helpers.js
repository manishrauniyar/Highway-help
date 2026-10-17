import { GOOGLE_MAPS_KEY, loadGoogleMaps } from './googleMaps'

export function formatDistance(km) {
  if (km == null || Number.isNaN(Number(km))) return '—'
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function formatDate(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function formatCurrency(amount) {
  if (amount == null) return '—'
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ')
}

// Place name from Google (same names you see in Google Maps).
// Needs "Geocoding API" enabled for your Google key. Returns null if it can't.
async function googlePlace(lat, lng) {
  if (!GOOGLE_MAPS_KEY) return null
  try {
    const google = await loadGoogleMaps()
    const { results } = await new google.maps.Geocoder().geocode({ location: { lat, lng } })
    const first = results?.[0]
    if (!first) return null
    const pick = (...types) =>
      types.map((t) => first.address_components.find((c) => c.types.includes(t))?.long_name).find(Boolean)
    const area = pick('neighborhood', 'sublocality_level_2', 'sublocality_level_1', 'sublocality')
    const city = pick('locality', 'administrative_area_level_2')
    const label = area && city && area !== city ? `${area}, ${city}` : area || city
    return label ? { label, address: first.formatted_address } : null
  } catch {
    return null
  }
}

// Backup place name from OpenStreetMap (free, but its names can differ from Google).
async function osmPlace(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`,
    )
    if (!response.ok) return null
    const data = await response.json()
    const a = data.address || {}
    const label = a.neighbourhood || a.suburb || a.village || a.town || a.city || a.county || data.name
    return label ? { label, address: data.display_name } : null
  } catch {
    return null
  }
}

// Gets the browser location and a readable place name.
// If the location fails, it falls back to Gorakhpur and says WHY in `reason`.
export async function getCurrentLocation() {
  const fallback = { lat: 26.7606, lng: 83.3732, label: 'Gorakhpur, Uttar Pradesh (default)', mocked: true }
  if (!window.isSecureContext) return { ...fallback, reason: 'insecure' }
  if (!navigator.geolocation) return { ...fallback, reason: 'unsupported' }

  let position
  try {
    position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      })
    })
  } catch (err) {
    return { ...fallback, reason: err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable' }
  }

  const lat = position.coords.latitude
  const lng = position.coords.longitude
  const accuracy = Math.round(position.coords.accuracy || 0) // metres
  const place = (await googlePlace(lat, lng)) || (await osmPlace(lat, lng))

  return {
    lat,
    lng,
    accuracy,
    label: place?.label || 'Current Location',
    address: place?.address || '',
    mocked: false,
  }
}

export const LOCATION_REASONS = {
  denied: 'location permission is blocked. Click the lock icon in the address bar, set Location to Allow, then press the location button.',
  timeout: 'getting your location took too long. Try again, ideally with GPS on.',
  unavailable: 'your device could not find its position. Turn on GPS / location services.',
  insecure: 'location only works on https:// or localhost (not on a plain http:// address).',
  unsupported: 'this browser does not support location.',
}

// Straight-line distance in km between two lat/lng points.
export function haversineKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some((v) => v == null)) return null
  const toRad = (v) => (v * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return Number((6371 * 2 * Math.asin(Math.sqrt(a))).toFixed(1))
}

// Rough arrival estimate (the backend does not provide one): ~4.5 min per km, minimum 3 min.
export function estimateEtaMin(distanceKm) {
  if (distanceKm == null) return null
  return Math.max(3, Math.round(distanceKm * 4.5))
}