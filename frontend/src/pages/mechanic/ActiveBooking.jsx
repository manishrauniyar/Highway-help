import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBookings } from '../../context/BookingContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import OTPInput from '../../components/common/OTPInput'
import { LocationIcon, PhoneIcon } from '../../components/common/Icons'
import { formatCurrency } from '../../utils/helpers'
import useShareLocation from '../../hooks/useShareLocation'

export default function MechanicActiveBooking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bookings, loading, advanceStatus, verifyOtp, finalizeService } = useBookings()
  const booking = bookings.find((b) => b.id === id)
  useShareLocation(booking)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [price, setPrice] = useState(booking?.price?.min || '')
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)

  // Runs an action and shows the server's error message if it fails.
  const attempt = async (fn) => {
    setActionError('')
    setBusy(true)
    try {
      return await fn()
    } catch (err) {
      setActionError(err.message)
      return null
    } finally {
      setBusy(false)
    }
  }

  if (!booking && loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-muted">Loading booking…</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-muted">Booking not found.</p>
        <Button as={Link} to="/mechanic/dashboard" className="mt-4">Back to dashboard</Button>
      </div>
    )
  }

  const handleVerify = async () => {
    setBusy(true)
    const result = await verifyOtp(booking.id, otp)
    setBusy(false)
    if (!result.success) setOtpError(result.message)
    else setOtpError('')
  }

  const handleComplete = async () => {
    const done = await attempt(() => finalizeService(booking.id, Number(price) || 0))
    if (done) navigate('/mechanic/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl tracking-wide">{booking.customerName}</h1>
          <p className="text-slate-muted text-sm mt-1">{booking.serviceType} · Booking #{String(booking.id).slice(-6).toUpperCase()}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <Card className="p-5 mb-6 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-slate-muted"><LocationIcon size={15} /> {booking.locationLabel}</span>
        <Button as="a" href={`tel:${booking.customerPhone}`} variant="outline" size="sm"><PhoneIcon size={14} /> Call</Button>
      </Card>

      {actionError && <p className="text-signal-light text-sm text-center mb-4">{actionError}</p>}

      {booking.status === 'accepted' && (
        <Button full disabled={busy} onClick={() => attempt(() => advanceStatus(booking.id, 'onway'))}>Start Moving Towards Customer</Button>
      )}

      {booking.status === 'onway' && (
        <Button full disabled={busy} onClick={() => attempt(() => advanceStatus(booking.id, 'arrived'))}>Mark as Arrived</Button>
      )}

      {booking.status === 'arrived' && (
        <Card className="p-5">
          <p className="text-sm text-slate-muted mb-4 text-center">Ask the customer for their 4-digit OTP to begin the service.</p>
          <OTPInput length={4} value={otp} onChange={setOtp} />
          {otpError && <p className="text-signal-light text-sm text-center mt-3">{otpError}</p>}
          <Button full className="mt-5" disabled={otp.length !== 4 || busy} onClick={handleVerify}>Verify OTP & Start Service</Button>
        </Card>
      )}

      {booking.status === 'started' && (
        <Card className="p-5">
          <p className="text-sm text-slate-muted mb-3">Enter the final service amount to mark this job complete.</p>
          <label className="text-xs text-slate-muted">Final Amount (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 mb-4 px-4 py-2.5 rounded-xl bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
          />
          <Button full onClick={handleComplete} disabled={!price || busy}>Mark Service Completed</Button>
        </Card>
      )}

      {booking.status === 'completed' && (
        <Card className="p-6 text-center">
          <p className="text-mint font-semibold">Service completed — {formatCurrency(booking.finalPrice)}</p>
          <p className="text-xs text-slate-muted mt-1">
            Payment status: {booking.paymentStatus === 'paid' ? 'Paid online' : booking.paymentStatus === 'due' ? 'Cash collected' : 'Awaiting customer payment'}
          </p>
          <Button as={Link} to="/mechanic/dashboard" className="mt-4">Back to Dashboard</Button>
        </Card>
      )}
    </div>
  )
}
