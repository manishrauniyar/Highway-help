import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import DataTable from '../../components/admin/DataTable'
import useApiData from '../../hooks/useApiData'
import { formatDate } from '../../utils/helpers'

export default function AdminUsers() {
  const { data: users, loading, error } = useApiData('/admin/users')
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'createdAt', label: 'Joined', render: (r) => formatDate(r.createdAt) },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Users</h1>
      <p className="text-slate-muted text-sm mb-6">Registered customers on the platform.</p>
      <AdminNav />
      {error && <p className="text-signal-light text-sm mb-4">{error}</p>}
      <DataTable columns={columns} rows={users} emptyLabel={loading ? 'Loading…' : 'No customers yet.'} />
    </div>
  )
}
