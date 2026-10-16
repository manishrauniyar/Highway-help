import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import StatCard from '../../components/admin/StatCard'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import { useBookings } from '../../context/BookingContext'
import useApiData from '../../hooks/useApiData'
import { UserIcon, WrenchIcon, WalletIcon, AlertIcon } from '../../components/common/Icons'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function AdminDashboard() {
  const { bookings } = useBookings()
  const { data: overview, error } = useApiData('/admin/overview', { userCount: 0, mechanicCount: 0, bookingCount: 0, revenue: 0 })
  const { data: complaints } = useApiData('/admin/complaints')
  const openComplaints = complaints.filter((c) => c.status === 'open').length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Admin Overview</h1>
      <p className="text-slate-muted text-sm mb-6">A live snapshot of Highway-help operations.</p>
      <AdminNav />
      {error && <p className="text-signal-light text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Customers" value={overview.userCount} icon={UserIcon} />
        <StatCard label="Registered Mechanics" value={overview.mechanicCount} icon={WrenchIcon} />
        <StatCard label="Total Bookings" value={overview.bookingCount} icon={WalletIcon} />
        <StatCard label="Open Complaints" value={openComplaints} icon={AlertIcon} accent="text-signal" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Recent Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-slate-muted">No bookings yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{b.customerName} → {b.mechanicName}</p>
                    <p className="text-xs text-slate-muted">{formatDate(b.createdAt)}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-4">Revenue Summary</h2>
          <p className="text-3xl font-display text-beacon">{formatCurrency(overview.revenue)}</p>
          <p className="text-xs text-slate-muted mt-1">Total from completed bookings</p>
        </Card>
      </div>
    </div>
  )
}
