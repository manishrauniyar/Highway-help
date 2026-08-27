export function formatDistance(km) {
  if (km == null || Number.isNaN(Number(km))) return 'Distance unavailable'
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${Number(km).toFixed(1)} km`
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

export function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: null, lng: null, label: 'Location unavailable' })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'Current Location' }),
      () => resolve({ lat: null, lng: null, label: 'Location unavailable' }),
      { timeout: 5000 },
    )
  })
}
