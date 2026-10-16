import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../utils/api'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { WrenchIcon } from '../../components/common/Icons'

export default function MechanicLogin() {
  const { mechanicLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.phone || !form.password) {
      setError('Please enter both phone number and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await mechanicLogin(form.phone.trim(), form.password)
      navigate('/mechanic/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="flex items-center gap-2 mb-1">
        <WrenchIcon size={22} className="text-beacon" />
        <h1 className="font-display text-3xl tracking-wide">Partner Login</h1>
      </div>
      <p className="text-slate-muted text-sm mb-8">Login to receive and manage roadside service requests.</p>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-signal-light text-sm">{error}</p>}
          <div>
            <label className="text-xs text-slate-muted">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
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
          <Button type="submit" full className="mt-2" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</Button>
        </form>
      </Card>
      <p className="text-center text-sm text-slate-muted mt-6">
        New partner? <Link to="/mechanic/register" className="text-beacon hover:underline">Register your workshop</Link>
      </p>
    </div>
  )
}
