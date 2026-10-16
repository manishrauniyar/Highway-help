import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LocationBar from '../../components/common/LocationBar'
import MechanicCard from '../../components/customer/MechanicCard'
import api, { getErrorMessage } from '../../utils/api'
import { useCatalog } from '../../context/CatalogContext'
import { AlertIcon } from '../../components/common/Icons'
import { getCurrentLocation, estimateEtaMin } from '../../utils/helpers'

export default function FindMechanic() {
  const { services, districts } = useCatalog()
  const [params] = useSearchParams()
  const emergency = params.get('emergency') === '1'
  const initialService = params.get('service') || 'all'
  const [serviceFilter, setServiceFilter] = useState(initialService)
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [highwayFilter, setHighwayFilter] = useState('all')

  const serviceNameFromId = (id) => services.find((s) => s.id === id)?.name

  // Highway options depend on the selected district; when no district is
  // chosen, show every highway/expressway across all districts.
  const highwayOptions = useMemo(() => {
    const source = districtFilter === 'all' ? districts : districts.filter((d) => d.id === districtFilter)
    return [...new Set(source.flatMap((d) => d.highways))].sort()
  }, [districtFilter])

  // Mechanics now come from the backend. Filtering happens on the server.
  const [mechanics, setMechanics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [coords, setCoords] = useState(null)

  // Get the customer's location once so the server can sort by real distance.
  useEffect(() => {
    getCurrentLocation().then((loc) => setCoords({ lat: loc.lat, lng: loc.lng }))
  }, [])

  useEffect(() => {
    if (!coords) return undefined
    let cancelled = false
    setLoading(true)
    setError('')
    const query = { lat: coords.lat, lng: coords.lng }
    if (serviceFilter !== 'all') query.service = serviceNameFromId(serviceFilter)
    if (vehicleFilter !== 'all') query.vehicleType = vehicleFilter
    if (districtFilter !== 'all') query.districtId = districtFilter
    if (highwayFilter !== 'all') query.highway = highwayFilter
    if (emergency) query.available = 'true'

    api.get('/mechanics', { params: query })
      .then(({ data }) => {
        if (!cancelled) setMechanics(data.map((m) => ({ ...m, etaMin: estimateEtaMin(m.distanceKm) })))
      })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [coords, serviceFilter, vehicleFilter, districtFilter, highwayFilter, emergency]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = mechanics

  const handleDistrictChange = (value) => {
    setDistrictFilter(value)
    setHighwayFilter('all')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-wide">Nearby Mechanics</h1>
          <p className="text-slate-muted text-sm mt-1">Sorted by distance from your current location.</p>
        </div>
        <LocationBar />
      </div>

      {emergency && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-signal/10 border border-signal/40 mb-6">
          <AlertIcon size={22} className="text-signal-light shrink-0" />
          <p className="text-sm text-signal-light">
            Emergency mode: showing the fastest available mechanics near you first. Stay safe and stay visible to traffic.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="px-4 py-2 rounded-full bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
        >
          <option value="all">All Services</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          className="px-4 py-2 rounded-full bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
        >
          <option value="all">All Vehicles</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
        </select>
        <select
          value={districtFilter}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="px-4 py-2 rounded-full bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
        >
          <option value="all">All Districts</option>
          {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select
          value={highwayFilter}
          onChange={(e) => setHighwayFilter(e.target.value)}
          className="px-4 py-2 rounded-full bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
        >
          <option value="all">All Highways / Expressways</option>
          {highwayOptions.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {error ? (
        <p className="text-center text-signal-light py-16">{error}</p>
      ) : loading ? (
        <p className="text-center text-slate-muted py-16">Finding mechanics near you…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-muted py-16">No mechanics match these filters right now. Try widening your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((m) => <MechanicCard key={m.id} mechanic={m} />)}
        </div>
      )}
    </div>
  )
}
