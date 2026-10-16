import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api, { getErrorMessage } from '../../utils/api'
import { useCatalog } from '../../context/CatalogContext'
import { useAuth } from '../../context/AuthContext'
import { useBookings } from '../../context/BookingContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import RatingStars from '../../components/common/RatingStars'
import { ShieldIcon, ClockIcon, LocationIcon, PhoneIcon } from '../../components/common/Icons'
import { formatDistance, formatCurrency, getCurrentLocation, haversineKm, estimateEtaMin } from '../../utils/helpers'

export default function MechanicDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createBooking } = useBookings()
  const { getDistrictById } = useCatalog()
  const [mechanic, setMechanic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [creating, setCreating] = useState(false)
  const [requestError, setRequestError] = useState('')
  const district = mechanic ? getDistrictById(mechanic.districtId) : null

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([api.get(`/mechanics/${id}`), getCurrentLocation()])
      .then(([{ data }, loc]) => {
        if (cancelled) return
        const distanceKm = haversineKm(loc.lat, loc.lng, data.location?.lat, data.location?.lng)
        setMechanic({ ...data, distanceKm, etaMin: estimateEtaMin(distanceKm) })
        setSelectedService(data.services?.[0] || '')
      })
      .catch((err) => { if (!cancelled) setLoadError(getErrorMessage(err, 'Mechanic not found.')) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-muted">Loading mechanic…</p>
      </div>
    )
  }

  if (!mechanic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-muted">{loadError || 'Mechanic not found.'}</p>
        <Button as={Link} to="/find-mechanic" className="mt-4">Back to search</Button>
      </div>
    )
  }

  const openRequestModal = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowModal(true)
  }

  const confirmRequest = async () => {
    setCreating(true)
    setRequestError('')
    try {
      const loc = await getCurrentLocation()
      const booking = await createBooking({
        mechanicId: mechanic.id,
        serviceType: selectedService,
        customerLocation: { lat: loc.lat, lng: loc.lng },
        locationLabel: loc.label,
      })
      setShowModal(false)
      navigate(`/booking/${booking.id}`)
    } catch (err) {
      setRequestError(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <img src={mechanic.photo} alt={mechanic.name} className="w-24 h-24 rounded-2xl object-cover border border-asphalt-600 mx-auto sm:mx-0" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-display text-2xl tracking-wide">{mechanic.name}</h1>
              {mechanic.verified && (
                <span className="flex items-center justify-center gap-1 text-xs text-mint">
                  <ShieldIcon size={14} /> Verified Partner
                </span>
              )}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <RatingStars value={Math.round(mechanic.rating)} readOnly />
              <span className="text-sm text-slate-muted">{mechanic.rating} · {mechanic.reviewsCount} reviews · {mechanic.experienceYears} yrs experience</span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm text-slate-muted">
              <span className="flex items-center gap-1"><LocationIcon size={14} /> {formatDistance(mechanic.distanceKm)} away</span>
              <span className="flex items-center gap-1"><ClockIcon size={14} /> ETA {mechanic.etaMin ?? '—'} min</span>
              <span className="flex items-center gap-1"><PhoneIcon size={14} /> {mechanic.phone}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-lane mb-2">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {mechanic.services.map((s) => (
                <span key={s} className="text-xs px-3 py-1 rounded-full bg-asphalt-700 text-slate-muted">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-lane mb-2">Estimated Price Range</h3>
            <p className="text-slate-muted text-sm">{formatCurrency(mechanic.price?.min)} – {formatCurrency(mechanic.price?.max)} depending on service</p>
          </div>
        </div>

        {district && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-lane mb-2">Coverage Area</h3>
            <p className="text-slate-muted text-sm mb-2">Based in {district.name}, covering:</p>
            <div className="flex flex-wrap gap-2">
              {district.highways.map((h) => (
                <span key={h} className="text-xs px-3 py-1 rounded-full bg-beacon/10 text-beacon border border-beacon/30">{h}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button size="lg" full disabled={!mechanic.available} onClick={openRequestModal}>
            {mechanic.available ? 'Request This Mechanic' : 'Currently Unavailable'}
          </Button>
          <Button as="a" href={`tel:${mechanic.phone}`} variant="outline" size="lg" full>Call Mechanic</Button>
        </div>
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Confirm Your Request">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-muted">Select the service you need from {mechanic.name}.</p>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
          >
            {mechanic.services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <p className="text-xs text-slate-muted">Your current location will be shared with {mechanic.name} once you confirm.</p>
          {requestError && <p className="text-signal-light text-sm">{requestError}</p>}
          <Button full onClick={confirmRequest} disabled={creating}>
            {creating ? 'Sending Request…' : 'Confirm & Request'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
