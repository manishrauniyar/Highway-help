import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useBookings } from '../../context/BookingContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { WalletIcon } from '../../components/common/Icons'

export default function MechanicEarnings() {
  const { user } = useAuth()
  const { getBookingsForMechanic, confirmCashReceived } = useBookings()
  const [error, setError] = useState('')
  const bookings = getBookingsForMechanic(user.id)
  const completed = bookings.filter((b) => b.status === 'completed')
  const amount = (b) => Number(b.finalPrice) || 0
  const sum = (list) => list.reduce((s, b) => s + amount(b), 0)

  // Money counts as earned only after the customer has really paid.
  const paid = completed.filter((b) => b.paymentStatus === 'paid')
  const total = sum(paid)
  const cash = sum(paid.filter((b) => b.paymentMethod === 'cash'))
  const online = sum(paid.filter((b) => b.paymentMethod !== 'cash'))
  const awaiting = sum(completed.filter((b) => b.paymentStatus !== 'paid'))

  const paymentLabel = (b) =>
    b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus === 'due' ? 'Cash due' : 'Awaiting payment'

  const markCashReceived = async (id) => {
    setError('')
    try {
      await confirmCashReceived(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Earnings & History</h1>
      <p className="text-slate-muted text-sm mb-8">Earnings are added only after the customer has paid.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
        <Card className="p-4">
          <p className="text-xl font-display text-beacon">{formatCurrency(awaiting)}</p>
          <p className="text-xs text-slate-muted mt-1">Awaiting Payment</p>
        </Card>
      </div>

      {error && <p className="text-signal-light text-sm mb-4">{error}</p>}

      <h2 className="font-semibold mb-3">Job History</h2>
      {bookings.length === 0 ? (
        <Card className="p-8 text-center text-slate-muted text-sm">No jobs yet. Accepted requests will appear here.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{b.customerName}</p>
                <p className="text-xs text-slate-muted">{b.serviceType} · {formatDate(b.createdAt)}</p>
                {b.status === 'completed' && (
                  <p className={`text-xs mt-1 ${b.paymentStatus === 'paid' ? 'text-mint' : 'text-beacon'}`}>{paymentLabel(b)}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {b.status === 'completed' && <span className="text-sm">{formatCurrency(b.finalPrice)}</span>}
                {b.status === 'completed' && b.paymentStatus === 'due' && b.paymentMethod === 'cash' && (
                  <Button size="sm" onClick={() => markCashReceived(b.id)}>Cash received</Button>
                )}
                <StatusBadge status={b.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}