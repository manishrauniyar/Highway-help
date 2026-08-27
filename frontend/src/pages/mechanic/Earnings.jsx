import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useBookings } from '../../context/BookingContext'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { WalletIcon } from '../../components/common/Icons'

export default function MechanicEarnings() {
  const { user } = useAuth()
  const { getBookingsForMechanic } = useBookings()
  const bookings = getBookingsForMechanic(user.id)
  const completed = bookings.filter((b) => b.status === 'completed')
  const total = completed.reduce((sum, b) => sum + (Number(b.finalPrice) || 0), 0)
  const cash = completed.filter((b) => b.paymentStatus === 'due').reduce((s, b) => s + (Number(b.finalPrice) || 0), 0)
  const online = completed.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + (Number(b.finalPrice) || 0), 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Earnings & History</h1>
      <p className="text-slate-muted text-sm mb-8">A summary of your completed jobs and payments.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <WalletIcon size={18} className="text-beacon mb-2" />
          <p className="text-xl font-display">{formatCurrency(total)}</p>
          <p className="text-xs text-slate-muted mt-1">Total Earned</p>
        </Card>
        <Card className="p-4">
          <p className="text-xl font-display">{formatCurrency(cash)}</p>
          <p className="text-xs text-slate-muted mt-1">Cash Collected</p>
        </Card>
        <Card className="p-4">
          <p className="text-xl font-display">{formatCurrency(online)}</p>
          <p className="text-xs text-slate-muted mt-1">Paid Online</p>
        </Card>
      </div>

      <h2 className="font-semibold mb-3">Job History</h2>
      {bookings.length === 0 ? (
        <Card className="p-8 text-center text-slate-muted text-sm">No jobs yet. Accepted requests will appear here.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{b.customerName}</p>
                <p className="text-xs text-slate-muted">{b.serviceType} · {formatDate(b.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                {b.status === 'completed' && <span className="text-sm">{formatCurrency(b.finalPrice)}</span>}
                <StatusBadge status={b.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
