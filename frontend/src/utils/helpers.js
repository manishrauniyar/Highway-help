
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

// Gets the actual browser location and converts coordinates into a readable place name.
export async function getCurrentLocation() {
  const fallback = {
    lat: 26.7606,
    lng: 83.3732,
    label: 'Gorakhpur, Uttar Pradesh',
    mocked: true
  }

  if (!navigator.geolocation) return fallback

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    })

    const lat = position.coords.latitude
    const lng = position.coords.longitude
    let label = 'Current Location'

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`
      )

      if (response.ok) {
        const data = await response.json()
        const address = data.address || {}

        label =
          address.suburb ||
          address.neighbourhood ||
          address.village ||
          address.town ||
          address.city ||
          address.county ||
          data.name ||
          label
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
    }

    return {
      lat,
      lng,
      label,
      mocked: false
    }
  } catch (error) {
    console.error('Geolocation failed:', error.message)
    return fallback
  }
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
