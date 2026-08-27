import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import DataTable from '../../components/admin/DataTable'
import Button from '../../components/common/Button'
import api from '../../utils/api'

export default function AdminMechanics() {
  const [mechanics, setMechanics] = useState([])
  useEffect(() => { api.get('/admin/mechanics').then(setMechanics).catch(() => setMechanics([])) }, [])

  const toggleVerified = async (id, verified) => {
    try { const updated = await api.patch(`/admin/mechanics/${id}/verify`, { verified: !verified }); setMechanics(prev => prev.map(m => m.id === id ? updated : m)) } catch {}
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'services', label: 'Services', render: (r) => r.services.join(', ') },
    { key: 'rating', label: 'Rating' },
    {
      key: 'verified',
      label: 'Status',
      render: (r) => (
        <span className={r.verified ? 'text-mint' : 'text-beacon'}>{r.verified ? 'Verified' : 'Pending'}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <Button size="sm" variant={r.verified ? 'subtle' : 'primary'} onClick={() => toggleVerified(r.id, r.verified)}>
          {r.verified ? 'Revoke' : 'Approve'}
        </Button>
      ),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Mechanics</h1>
      <p className="text-slate-muted text-sm mb-6">Approve and manage mechanic partners.</p>
      <AdminNav />
      <DataTable columns={columns} rows={mechanics} emptyLabel="No mechanics registered yet." />
    </div>
  )
}
