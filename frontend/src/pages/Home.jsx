import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import ServiceCard from '../components/customer/ServiceCard'
import PetrolPumpCard from '../components/customer/PetrolPumpCard'
import MapPlaceholder from '../components/common/MapPlaceholder'
import LocationBar from '../components/common/LocationBar'
import api from '../utils/api'
import { ShieldIcon, ClockIcon, StarIcon } from '../components/common/Icons'

export default function Home() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [petrolPumps, setPetrolPumps] = useState([])

  useEffect(() => {
    Promise.all([api.get('/services'), api.get('/petrol-pumps')])
      .then(([serviceData, pumpData]) => { setServices(serviceData); setPetrolPumps(pumpData) })
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-asphalt-700">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-5"><LocationBar /></div>
            <p className="uppercase tracking-[0.2em] text-beacon text-xs font-semibold mb-3">24 / 7 Roadside Assistance</p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.08] tracking-wide">
              Vehicle Breakdown?<br /> <span className="text-beacon">Help Is Nearby.</span>
            </h1>
            <p className="text-slate-muted mt-5 max-w-md">
              Stuck on a highway at 2 AM or stalled in city traffic — share your location and a verified mechanic is on the way in minutes.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button size="lg" onClick={() => navigate('/find-mechanic')}>Find a Mechanic</Button>
              <Button size="lg" variant="danger" onClick={() => navigate('/find-mechanic?emergency=1')}>Emergency Assistance</Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-9 text-sm text-slate-muted">
              <span className="flex items-center gap-2"><ShieldIcon size={16} className="text-mint" /> Verified mechanics</span>
              <span className="flex items-center gap-2"><ClockIcon size={16} className="text-beacon" /> Avg. 12 min arrival</span>
              <span className="flex items-center gap-2"><StarIcon size={16} filled className="text-beacon" /> 4.7+ average rating</span>
            </div>
          </div>

          <MapPlaceholder mode="searching" className="h-80 sm:h-96" />
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-beacon text-xs font-semibold uppercase tracking-[0.2em] mb-2">What do you need?</p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-wide">Choose a Service</h2>
          </div>
          <Link to="/find-mechanic" className="hidden sm:block text-sm text-beacon hover:underline">See all mechanics →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </section>

      {/* Petrol pumps */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-20">
        <div className="mb-8">
          <p className="text-mint text-xs font-semibold uppercase tracking-[0.2em] mb-2">Running low on fuel?</p>
          <h2 className="font-display text-2xl sm:text-3xl tracking-wide">Nearby Petrol Pumps</h2>
          <p className="text-slate-muted text-sm mt-2 max-w-xl">
            Locate the closest fuel stations right now. Fuel delivery to your exact location is coming in a future update.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {petrolPumps.map((p) => <PetrolPumpCard key={p.id} pump={p} />)}
        </div>
      </section>
    </div>
  )
}
