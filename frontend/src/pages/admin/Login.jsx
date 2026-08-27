import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { ShieldIcon } from '../../components/common/Icons'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.email.toLowerCase() !== 'admin@highwayhelp.com' || form.password !== 'admin123') {
      setError('Invalid admin credentials.')
      return
    }
    login({ id: 'ADM001', name: 'Admin', email: form.email, role: 'admin' })
    navigate('/admin/dashboard')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="flex items-center gap-2 mb-1">
        <ShieldIcon size={22} className="text-beacon" />
        <h1 className="font-display text-3xl tracking-wide">Admin Portal</h1>
      </div>
      <p className="text-slate-muted text-sm mb-8">Restricted access for the Highway-help operations team.</p>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-signal-light text-sm">{error}</p>}
          <div>
            <label className="text-xs text-slate-muted">Admin Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@highwayhelp.com"
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-asphalt-700 border border-asphalt-500 focus-ring focus:border-beacon text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-muted">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-asphalt-700 border border-asphalt-500 focus-ring focus:border-beacon text-sm"
            />
          </div>
          <Button type="submit" full className="mt-2">Login</Button>
        </form>
        <p className="text-[11px] text-slate-muted mt-4 text-center"></p>
      </Card>
    </div>
  )
}
