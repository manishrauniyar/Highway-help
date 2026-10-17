import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LocationBar from '../../components/common/LocationBar'
import MechanicCard from '../../components/customer/MechanicCard'
import api, { getErrorMessage } from '../../utils/api'
import { useCatalog } from '../../context/CatalogContext'
import { AlertIcon } from '../../components/common/Icons'
import NearbyMap from '../../components/customer/NearbyMap'
import AiHelper from '../../components/customer/AiHelper'
import { getCurrentLocation, estimateEtaMin, LOCATION_REASONS } from '../../utils/helpers'

const RADIUS_STEPS = ['5', '10', '25', '50', 'all'] // km; 'all' = any distance

export default function FindMechanic() {
  const { services, districts } = useCatalog()
  const [params] = useSearchParams()
  const emergency = params.get('emergency') === '1'
  const initialService = params.get('service') || 'all'
  const [serviceFilter, setServiceFilter] = useState(initialService)
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [highwayFilter, setHighwayFilter] = useState('all')
  const [radius, setRadius] = useState('10')

  const serviceNameFromId = (id) => services.find((s) => s.id === id)?.name

  // Highway options depend on the selected district; when no district is
  // chosen, show every highway/expressway across all districts.
  const highwayOptions = useMemo(() => {
    const source = districtFilter === 'all' ? districts : districts.filter((d) => d.id === districtFilter)
    return [...new Set(source.flatMap((d) => d.highways))].sort()
  }, [districtFilter])

  // Mechanics come from the backend. Filtering by service etc. happens on the server.
  const [mechanics, setMechanics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [coords, setCoords] = useState(null)

  // Customer's location. Called on page load and whenever "current location" is pressed.
  const [loc, setLoc] = useState(null)
  const [locating, setLocating] = useState(true)
  const [focusTick, setFocusTick] = useState(0)
  const locate = async (focusMap = false) => {
    setLocating(true)
    const l = await getCurrentLocation()
    setLoc(l)
    setCoords({ lat: l.lat, lng: l.lng })
    setLocating(false)
    if (focusMap) setFocusTick((n) => n + 1) // tells the map to zoom to the user
  }
  useEffect(() => { locate() }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  // Keep only mechanics inside the chosen radius around the user's location.
  const filtered = useMemo(
    () => (radius === 'all' ? mechanics : mechanics.filter((m) => m.distanceKm != null && m.distanceKm <= Number(radius))),
    [mechanics, radius],
  )
  const onlineCount = filtered.filter((m) => m.available).length
  const nearestKm = mechanics.reduce((min, m) => (m.distanceKm != null && m.distanceKm < min ? m.distanceKm : min), Infinity)
  const nextRadius = RADIUS_STEPS[RADIUS_STEPS.indexOf(radius) + 1]
  const placeName = loc?.mocked ? 'the default location' : loc?.label

  const handleDistrictChange = (value) => {
    setDistrictFilter(value)
    setHighwayFilter('all')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-wide">Nearby Mechanics</h1>
          <p className="text-slate-muted text-sm mt-1">Press the location button to find mechanics around you.</p>
        </div>
        <LocationBar location={loc} loading={locating} onRefresh={() => locate(true)} />
      </div>
      <AiHelper onPickService={setServiceFilter} />

      {loc?.mocked && (
        <p className="text-xs text-beacon mb-4">
          Showing the default location (Gorakhpur) because {LOCATION_REASONS[loc.reason]}
        </p>
      )}
      {loc && !loc.mocked && (
        <p className="text-xs text-slate-muted mb-4">
          Detected: {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
          {loc.accuracy ? ` (accurate to about ${loc.accuracy} m)` : ''}
          {loc.address ? ` · ${loc.address}` : ''}
        </p>
      )}

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
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="px-4 py-2 rounded-full bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
        >
          {RADIUS_STEPS.map((r) => (
            <option key={r} value={r}>{r === 'all' ? 'Any distance' : `Within ${r} km`}</option>
          ))}
        </select>
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

      {/* Automatic answer: does this location have mechanics or not? */}
      {!loading && !error && !locating && (
        filtered.length > 0 ? (
          <div className="p-4 rounded-2xl bg-mint/10 border border-mint/40 mb-6 text-sm text-mint">
            {filtered.length} mechanic{filtered.length === 1 ? '' : 's'} found{radius === 'all' ? '' : ` within ${radius} km`} of {placeName}
            {' '}({onlineCount} online now).
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-signal/10 border border-signal/40 mb-6 text-sm text-signal-light flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="flex-1">
              No mechanics found within {radius} km of {placeName}.
              {nearestKm !== Infinity ? ` The nearest one is ${nearestKm} km away.` : ''}
            </span>
            {nextRadius && (
              <button
                onClick={() => setRadius(nextRadius)}
                className="px-4 py-2 rounded-xl bg-beacon text-asphalt-900 font-semibold"
              >
                Search {nextRadius === 'all' ? 'any distance' : `within ${nextRadius} km`}
              </button>
            )}
          </div>
        )
      )}

      <NearbyMap center={coords} mechanics={filtered} focusTick={focusTick} onLocate={() => locate(true)} className="h-72 sm:h-96 mb-8" />

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