import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBookings } from '../../context/BookingContext'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import RatingStars from '../../components/common/RatingStars'
import Button from '../../components/common/Button'
import { formatDate, formatCurrency } from '../../utils/helpers'

export default function BookingHistory() {
  const { user } = useAuth()
  const { getBookingsForCustomer } = useBookings()
  const bookings = getBookingsForCustomer(user.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Booking History</h1>
      <p className="text-slate-muted text-sm mb-8">All your roadside assistance requests, past and present.</p>

      {bookings.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-slate-muted mb-4">You haven't booked any assistance yet.</p>
          <Button as={Link} to="/find-mechanic">Find a Mechanic</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={b.mechanicPhoto} alt={b.mechanicName} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold">{b.mechanicName}</p>
                    <p className="text-xs text-slate-muted">{b.serviceType} · {formatDate(b.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-asphalt-600">
                <div className="flex items-center gap-3">
                  {b.status === 'completed' && <span className="text-sm text-slate-muted">{formatCurrency(b.finalPrice)}</span>}
                  {b.rating && <RatingStars value={b.rating} readOnly size={14} />}
                </div>
                <Link to={`/booking/${b.id}`} className="text-sm text-beacon hover:underline">View details →</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
