import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import DataTable from '../../components/admin/DataTable'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  useEffect(() => { api.get('/admin/users').then(setUsers).catch(() => setUsers([])) }, [])
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'bookingsCount', label: 'Bookings' },
    { key: 'joined', label: 'Joined', render: (r) => formatDate(r.joined) },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Users</h1>
      <p className="text-slate-muted text-sm mb-6">Registered customers on the platform.</p>
      <AdminNav />
      <DataTable columns={columns} rows={users} emptyLabel="No customers registered yet." />
    </div>
  )
}
