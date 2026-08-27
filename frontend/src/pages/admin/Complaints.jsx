import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import DataTable from '../../components/admin/DataTable'
import Button from '../../components/common/Button'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  useEffect(() => { api.get('/admin/complaints').then(setComplaints).catch(() => setComplaints([])) }, [])

  const resolve = async (id) => { try { const updated = await api.patch(`/admin/complaints/${id}/resolve`, {}); setComplaints(prev => prev.map(c => c.id === id ? updated : c)) } catch {} }

  const columns = [
    { key: 'from', label: 'From' },
    { key: 'against', label: 'Against' },
    { key: 'subject', label: 'Subject' },
    { key: 'createdAt', label: 'Filed', render: (r) => formatDate(r.createdAt) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={r.status === 'resolved' ? 'text-mint' : 'text-signal-light'}>
          {r.status === 'resolved' ? 'Resolved' : 'Open'}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        r.status === 'open'
          ? <Button size="sm" onClick={() => resolve(r.id)}>Mark Resolved</Button>
          : <span className="text-xs text-slate-muted">—</span>
      ),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Complaints</h1>
      <p className="text-slate-muted text-sm mb-6">Customer complaints filed against mechanic partners.</p>
      <AdminNav />
      <DataTable columns={columns} rows={complaints} emptyLabel="No complaints yet." />
    </div>
  )
}
