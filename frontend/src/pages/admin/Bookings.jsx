import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import DataTable from '../../components/admin/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import { useBookings } from '../../context/BookingContext'
import { formatDate, formatCurrency } from '../../utils/helpers'

export default function AdminBookings() {
  const { bookings } = useBookings()

  const columns = [
    { key: 'id', label: 'Booking ID', render: (r) => `#${String(r.id).slice(-6).toUpperCase()}` },
    { key: 'customerName', label: 'Customer' },
    { key: 'mechanicName', label: 'Mechanic' },
    { key: 'serviceType', label: 'Service' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'finalPrice', label: 'Amount', render: (r) => formatCurrency(r.finalPrice) },
    { key: 'createdAt', label: 'Created', render: (r) => formatDate(r.createdAt) },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Bookings</h1>
      <p className="text-slate-muted text-sm mb-6">All roadside assistance requests across the platform.</p>
      <AdminNav />
      <DataTable columns={columns} rows={bookings} emptyLabel="No bookings have been made yet." />
    </div>
  )
}
