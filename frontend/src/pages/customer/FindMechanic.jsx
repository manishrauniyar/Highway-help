import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LocationBar from '../../components/common/LocationBar'
import MechanicCard from '../../components/customer/MechanicCard'
import api from '../../utils/api'
import { AlertIcon } from '../../components/common/Icons'

export default function FindMechanic() {
  const [params] = useSearchParams()
  const emergency = params.get('emergency') === '1'
  const initialService = params.get('service') || 'all'
  const [serviceFilter, setServiceFilter] = useState(initialService)
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [highwayFilter, setHighwayFilter] = useState('all')
  const [mechanics, setMechanics] = useState([])
  const [services, setServices] = useState([])
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/services'), api.get('/districts')])
      .then(([serviceData, districtData]) => { setServices(serviceData); setDistricts(districtData) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const q = new URLSearchParams()
    if (serviceFilter !== 'all') { const service = services.find(s => s.id === serviceFilter); if (service) q.set('service', service.name) }
    if (vehicleFilter !== 'all') q.set('vehicleType', vehicleFilter)
    if (districtFilter !== 'all') q.set('districtId', districtFilter)
    if (highwayFilter !== 'all') q.set('highway', highwayFilter)
    setLoading(true)
    api.get(`/mechanics${q.toString() ? `?${q.toString()}` : ''}`).then(setMechanics).catch(() => setMechanics([])).finally(() => setLoading(false))
  }, [serviceFilter, vehicleFilter, districtFilter, highwayFilter, services])


  const highwayOptions = useMemo(() => {
    const source = districtFilter === 'all' ? districts : districts.filter((d) => d.id === districtFilter)
    return [...new Set(source.flatMap((d) => d.highways || []))].sort()
  }, [districtFilter, districts])

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

      {loading ? (
        <p className="text-center text-slate-muted py-16">Loading mechanics…</p>
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
