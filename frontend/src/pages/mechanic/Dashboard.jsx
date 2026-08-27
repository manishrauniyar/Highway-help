import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBookings } from '../../context/BookingContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RequestCard from '../../components/mechanic/RequestCard'
import StatusBadge from '../../components/common/StatusBadge'
import { WalletIcon, ShieldIcon } from '../../components/common/Icons'
import { formatCurrency } from '../../utils/helpers'

export default function MechanicDashboard() {
  const { user } = useAuth()
  const { getBookingsForMechanic, acceptBooking, rejectBooking } = useBookings()
  const [online, setOnline] = useState(true)

  const myBookings = getBookingsForMechanic(user.id)
  const pending = myBookings.filter((b) => b.status === 'requested')
  const active = myBookings.filter((b) => ['accepted', 'onway', 'arrived', 'started'].includes(b.status))
  const completed = myBookings.filter((b) => b.status === 'completed')
  const earnings = completed.reduce((sum, b) => sum + (Number(b.finalPrice) || 0), 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-wide">Welcome, {user.name}</h1>
          <p className="text-slate-muted text-sm mt-1 flex items-center gap-2">
            {user.verified ? (
              <span className="flex items-center gap-1 text-mint"><ShieldIcon size={14} /> Verified partner</span>
            ) : (
              <span className="text-beacon">Pending admin approval</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setOnline(!online)}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
            online ? 'bg-mint/20 text-mint border-mint/40' : 'bg-asphalt-700 text-slate-muted border-asphalt-500'
          }`}
        >
          ● {online ? 'Online' : 'Offline'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-2xl font-display">{pending.length}</p>
          <p className="text-xs text-slate-muted mt-1">Pending Requests</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-display">{completed.length}</p>
          <p className="text-xs text-slate-muted mt-1">Jobs Completed</p>
        </Card>
        <Card className="p-4 col-span-2 sm:col-span-1">
          <p className="text-2xl font-display">{formatCurrency(earnings)}</p>
          <p className="text-xs text-slate-muted mt-1">Total Earnings</p>
        </Card>
      </div>

      {active.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3">Active Booking</h2>
          {active.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{b.customerName}</p>
                <p className="text-xs text-slate-muted">{b.serviceType}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                <Button as={Link} to={`/mechanic/active/${b.id}`} size="sm">Open</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mb-8">
        <h2 className="font-semibold mb-3">Incoming Requests {!online && <span className="text-xs text-slate-muted font-normal">(you're offline)</span>}</h2>
        {!online || pending.length === 0 ? (
          <Card className="p-8 text-center text-sm text-slate-muted">
            {online ? 'No new requests right now. We\'ll notify you instantly.' : 'Go online to start receiving requests.'}
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((b) => (
              <RequestCard key={b.id} booking={b} onAccept={acceptBooking} onReject={rejectBooking} />
            ))}
          </div>
        )}
      </div>

      <Button as={Link} to="/mechanic/earnings" variant="ghost" full>
        <WalletIcon size={16} /> View Earnings & History
      </Button>
    </div>
  )
}
