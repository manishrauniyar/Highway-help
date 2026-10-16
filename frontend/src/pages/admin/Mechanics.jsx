import React, { useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import DataTable from '../../components/admin/DataTable'
import Button from '../../components/common/Button'
import api, { getErrorMessage } from '../../utils/api'
import useApiData from '../../hooks/useApiData'

export default function AdminMechanics() {
  const { data: mechanics, setData: setMechanics, loading, error: loadError } = useApiData('/admin/mechanics')
  const [error, setError] = useState('')

  // Saves the approval to the database, then updates the row.
  const toggleVerified = async (mechanic) => {
    setError('')
    try {
      const { data } = await api.patch(`/admin/mechanics/${mechanic.id}/verify`, { verified: !mechanic.verified })
      setMechanics((prev) => prev.map((m) => (m.id === data.id ? data : m)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'services', label: 'Services', render: (r) => (r.services || []).join(', ') },
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
        <Button size="sm" variant={r.verified ? 'subtle' : 'primary'} onClick={() => toggleVerified(r)}>
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
      {(error || loadError) && <p className="text-signal-light text-sm mb-4">{error || loadError}</p>}
      <DataTable columns={columns} rows={mechanics} emptyLabel={loading ? 'Loading…' : 'No mechanics yet.'} />
    </div>
  )
}
