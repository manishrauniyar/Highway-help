import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBookings, STATUS_FLOW } from '../../context/BookingContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import BookingStatusTracker from '../../components/customer/BookingStatusTracker'
import MapPlaceholder from '../../components/common/MapPlaceholder'
import RatingStars from '../../components/common/RatingStars'
import StatusBadge from '../../components/common/StatusBadge'
import { PhoneIcon, WalletIcon } from '../../components/common/Icons'
import { formatCurrency } from '../../utils/helpers'

export default function BookingTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bookings, cancelBooking, submitPayment, submitRating, advanceStatus } = useBookings()
  const booking = bookings.find((b) => b.id === id)
  const [showPayment, setShowPayment] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-muted">We couldn't find this booking.</p>
        <Button as={Link} to="/find-mechanic" className="mt-4">Find a mechanic</Button>
      </div>
    )
  }

  const isActive = !['completed', 'cancelled', 'rejected'].includes(booking.status)
  const needsPayment = booking.status === 'completed' && booking.paymentStatus === 'pending'
  const canRate = booking.status === 'completed' && booking.paymentStatus !== 'pending' && booking.rating == null

  const simulateNext = () => {
    const idx = STATUS_FLOW.indexOf(booking.status)
    if (idx >= 0 && idx < STATUS_FLOW.length - 2) {
      advanceStatus(booking.id, STATUS_FLOW[idx + 1])
    }
  }

  const handlePayment = (method) => {
    submitPayment(booking.id, method)
    setShowPayment(false)
  }

  const handleRating = () => {
    submitRating(booking.id, rating, review)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl tracking-wide">Booking {booking.id}</h1>
          <p className="text-slate-muted text-sm mt-1">{booking.serviceType} · {booking.mechanicName}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {isActive && (
        <>
          <MapPlaceholder mode="tracking" mechanicName={booking.mechanicName} etaMin={booking.etaMin} className="h-64 mb-6" />

          <Card className="p-5 mb-6">
            <BookingStatusTracker status={booking.status} />
          </Card>

          <Card className="p-5 mb-6 flex items-center gap-4">
            <img src={booking.mechanicPhoto} alt={booking.mechanicName} className="w-14 h-14 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{booking.mechanicName}</p>
              <p className="text-xs text-slate-muted">ETA {booking.etaMin} min · {booking.distanceKm} km away</p>
            </div>
            <Button as="a" href={`tel:${booking.mechanicPhone}`} variant="outline" size="sm">
              <PhoneIcon size={15} /> Call
            </Button>
          </Card>

          {booking.status === 'arrived' && (
            <Card className="p-5 mb-6 text-center">
              <p className="text-sm text-slate-muted mb-2">Share this OTP with your mechanic to start the service</p>
              <p className="font-mono text-4xl tracking-[0.4em] text-beacon">{booking.otp}</p>
            </Card>
          )}

          {booking.status === 'requested' && (
            <Button variant="danger" full onClick={() => cancelBooking(booking.id)}>Cancel Request</Button>
          )}

          <div className="mt-8 pt-6 border-t border-dashed border-asphalt-600">
            <p className="text-xs text-slate-muted mb-2">Booking updates are synchronized with your current session.</p>
            <Button variant="subtle" size="sm" onClick={simulateNext}>Simulate Next Status →</Button>
          </div>
        </>
      )}

      {booking.status === 'cancelled' && (
        <Card className="p-6 text-center">
          <p className="text-signal-light font-semibold mb-2">This booking was cancelled.</p>
          <Button as={Link} to="/find-mechanic">Book Another Mechanic</Button>
        </Card>
      )}

      {booking.status === 'completed' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-muted">Final Amount</p>
              <p className="font-display text-2xl">{formatCurrency(booking.finalPrice || booking.price?.min)}</p>
            </div>
            <StatusBadge status={booking.paymentStatus === 'paid' ? 'completed' : booking.paymentStatus === 'due' ? 'requested' : 'accepted'} className="hidden" />
            <span className="text-xs uppercase tracking-wide text-slate-muted">
              {booking.paymentStatus === 'paid' ? 'Paid Online' : booking.paymentStatus === 'due' ? 'Cash Due' : 'Payment Pending'}
            </span>
          </div>

          {needsPayment ? (
            <Button full onClick={() => setShowPayment(true)}><WalletIcon size={16} /> Pay Now</Button>
          ) : canRate ? (
            <div className="pt-4 border-t border-asphalt-600">
              <p className="font-semibold mb-3">Rate your experience with {booking.mechanicName}</p>
              <RatingStars value={rating} onChange={setRating} size={26} />
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Leave a quick review (optional)"
                rows={3}
                className="w-full mt-3 px-4 py-2.5 rounded-xl bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
              />
              <Button full className="mt-3" disabled={rating === 0} onClick={handleRating}>Submit Rating</Button>
            </div>
          ) : (
            <div className="pt-4 border-t border-asphalt-600 text-center">
              <p className="text-mint font-semibold mb-3">Thanks for rating {booking.mechanicName}!</p>
              <RatingStars value={booking.rating} readOnly />
              <Button as={Link} to="/find-mechanic" className="mt-4">Book Another Service</Button>
            </div>
          )}
        </Card>
      )}

      <Modal open={showPayment} onClose={() => setShowPayment(false)} title="Choose Payment Method">
        <div className="flex flex-col gap-3">
          <Button variant="outline" full onClick={() => handlePayment('cash')}>Pay with Cash</Button>
          <Button full onClick={() => handlePayment('online')}>Pay Online (UPI / Card)</Button>
        </div>
      </Modal>
    </div>
  )
}
