import React, { useEffect, useRef, useState } from 'react'
import api from '../../utils/api'
import { getSocket } from '../../utils/socket'
import { GOOGLE_MAPS_KEY, loadGoogleMaps } from '../../utils/googleMaps'
import MapPlaceholder from '../common/MapPlaceholder'
export default function TrackingMap({ booking, className = '' }) {
  const mapDiv = useRef(null)
  const mapRef = useRef(null)
  const markers = useRef({})
  const line = useRef(null)
  const fittedFor = useRef(null)
  const lastRoute = useRef(0)
  const [failed, setFailed] = useState(!GOOGLE_MAPS_KEY)
  const [mech, setMech] = useState(null)
  const [info, setInfo] = useState(null)
  const cust = booking.customerLocation

  // Mechanic position: first from the server, then live from the socket.
  useEffect(() => {
    let alive = true
    api.get(`/mechanics/${booking.mechanic}`)
      .then(({ data }) => { if (alive && data.location) setMech(data.location) })
      .catch(() => {})
    const socket = getSocket()
    const onLoc = (p) => { if (alive) setMech({ lat: p.lat, lng: p.lng }) }
    socket.on('mechanic_location', onLoc)
    return () => { alive = false; socket.off('mechanic_location', onLoc) }
  }, [booking.mechanic])

  // Route + real ETA from the backend (refreshed at most every 15 seconds).
  useEffect(() => {
    if (failed || !mech || !cust) return
    if (info && Date.now() - lastRoute.current < 15000) return
    lastRoute.current = Date.now()
    api.get('/maps/route', { params: { fromLat: mech.lat, fromLng: mech.lng, toLat: cust.lat, toLng: cust.lng } })
      .then(({ data }) => setInfo(data))
      .catch(() => {})
  }, [mech, cust?.lat, cust?.lng, failed]) // eslint-disable-line react-hooks/exhaustive-deps

  // Draw the map, markers and route line.
  useEffect(() => {
    if (failed || !cust) return
    window.gm_authFailure = () => setFailed(true) // wrong or restricted API key
    loadGoogleMaps().then((google) => {
      if (!mapDiv.current) return
      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(mapDiv.current, {
          center: { lat: cust.lat, lng: cust.lng }, zoom: 14, disableDefaultUI: true, zoomControl: true,
        })
      }
      const map = mapRef.current
      const put = (key, pos, label) => {
        if (!markers.current[key]) markers.current[key] = new google.maps.Marker({ map, label, title: label })
        markers.current[key].setPosition(pos)
      }
      put('cust', { lat: cust.lat, lng: cust.lng }, 'You')
      if (mech) put('mech', { lat: mech.lat, lng: mech.lng }, 'Mechanic')

      if (info?.polyline) {
        const path = google.maps.geometry.encoding.decodePath(info.polyline)
        if (!line.current) line.current = new google.maps.Polyline({ map, strokeColor: '#F59E0B', strokeWeight: 5 })
        line.current.setPath(path)
        if (fittedFor.current !== info) {
          const bounds = new google.maps.LatLngBounds()
          path.forEach((p) => bounds.extend(p))
          map.fitBounds(bounds, 40)
          fittedFor.current = info
        }
      }
    }).catch(() => setFailed(true))
  }, [failed, cust?.lat, cust?.lng, mech, info]) // eslint-disable-line react-hooks/exhaustive-deps

  // No key or no customer location: show the old placeholder instead.
  if (failed || !cust) {
    return <MapPlaceholder mode="tracking" mechanicName={booking.mechanicName} etaMin={booking.etaMin} className={className} />
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapDiv} className="w-full h-full rounded-2xl overflow-hidden" />
      {info && (
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-asphalt-900/90 text-sm">
          <span className="text-beacon font-semibold">ETA {info.durationMin} min</span> · {info.distanceKm} km
        </div>
      )}
    </div>
  )
}
