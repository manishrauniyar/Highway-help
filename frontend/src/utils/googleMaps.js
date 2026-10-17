export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

let loader = null

// Loads the Google Maps script once for the whole app.
export function loadGoogleMaps() {
  if (window.google?.maps?.geometry) return Promise.resolve(window.google)
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=geometry`
      s.async = true
      s.onload = () => resolve(window.google)
      s.onerror = () => { loader = null; reject(new Error('Google Maps failed to load')) }
      document.head.appendChild(s)
    })
  }
  return loader
}
