import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GOOGLE_MAPS_KEY, loadGoogleMaps } from '../../utils/googleMaps'
import { formatDistance } from '../../utils/helpers'

// Uber / Rapido style map: your live location (blue dot) and nearby mechanics.
// Tap a mechanic pin to see a small card with a "View and Book" button.
export default function NearbyMap({ center, mechanics, className = '' }) {
  const mapDiv = useRef(null)
  const mapRef = useRef(null)
  const meRef = useRef(null)
  const pins = useRef({})
  const [failed, setFailed] = useState(!GOOGLE_MAPS_KEY)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (failed || !center) return
    window.gm_authFailure = () => setFailed(true) // wrong or restricted API key
    loadGoogleMaps().then((google) => {
      if (!mapDiv.current) return
      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(mapDiv.current, {
          center, zoom: 14, disableDefaultUI: true, zoomControl: true, clickableIcons: false,
        })
        mapRef.current.addListener('click', () => setSelected(null))
      }
      const map = mapRef.current

      // You: blue dot
      if (!meRef.current) {
        meRef.current = new google.maps.Marker({
          map, title: 'You', zIndex: 999,
          icon: { path: google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#3B82F6', fillOpacity: 1, strokeColor: '#FFFFFF', strokeWeight: 3 },
        })
      }
      meRef.current.setPosition(center)

      // Mechanics: amber pin with rating (grey when offline)
      const withLocation = mechanics.filter((m) => m.location?.lat != null && m.location?.lng != null)
      const keep = new Set(withLocation.map((m) => m.id))
      Object.keys(pins.current).forEach((id) => {
        if (!keep.has(id)) { pins.current[id].setMap(null); delete pins.current[id] }
      })
      withLocation.forEach((m) => {
        const icon = { path: google.maps.SymbolPath.CIRCLE, scale: 15, fillColor: m.available ? '#F59E0B' : '#64748B', fillOpacity: 1, strokeColor: '#0F172A', strokeWeight: 2 }
        const label = { text: Number(m.rating || 0).toFixed(1), color: '#0F172A', fontWeight: 'bold', fontSize: '11px' }
        if (!pins.current[m.id]) {
          pins.current[m.id] = new google.maps.Marker({ map, title: m.name })
          pins.current[m.id].addListener('click', () => setSelected(m))
        }
        pins.current[m.id].setIcon(icon)
        pins.current[m.id].setLabel(label)
        pins.current[m.id].setPosition({ lat: m.location.lat, lng: m.location.lng })
      })

      // Zoom to fit you + the nearest mechanics
      const bounds = new google.maps.LatLngBounds()
      bounds.extend(center)
      withLocation.slice(0, 6).forEach((m) => bounds.extend({ lat: m.location.lat, lng: m.location.lng }))
      if (withLocation.length) map.fitBounds(bounds, 50)
      else map.setCenter(center)
    }).catch(() => setFailed(true))
  }, [failed, center?.lat, center?.lng, mechanics]) // eslint-disable-line react-hooks/exhaustive-deps

  if (failed || !center) return null // no key: the list below still works

  return (
    <div className={`relative ${className}`}>
      <div ref={mapDiv} className="w-full h-full rounded-2xl overflow-hidden" />

      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-asphalt-900/90 text-xs">
        {mechanics.length} mechanic{mechanics.length === 1 ? '' : 's'} near you
      </div>

      {selected && (
        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-asphalt-800 border border-asphalt-500 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{selected.name}</p>
            <p className="text-xs text-slate-muted">
              {Number(selected.rating || 0).toFixed(1)} stars · {formatDistance(selected.distanceKm)}
              {selected.etaMin != null ? ` · ETA ${selected.etaMin} min` : ''}
            </p>
            <p className={`text-xs font-semibold ${selected.available ? 'text-mint' : 'text-slate-muted'}`}>
              {selected.available ? 'Available now' : 'Offline'}
            </p>
          </div>
          <Link to={`/mechanic-details/${selected.id}`} className="px-4 py-2 rounded-xl bg-beacon text-asphalt-900 text-sm font-semibold">
            View and Book
          </Link>
        </div>
      )}
    </div>
  )
}
