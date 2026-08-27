import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import api from '../../utils/api'

export default function MechanicRegister() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', workshop: '', service: '', password: '' })

  useEffect(() => { api.get('/services').then(setServices).catch(() => {}) }, [])
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.phone || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    try {
      const payload = { ...form, services: form.service ? [form.service] : [], vehicleTypes: [] }
      const { token, mechanic } = await api.post('/auth/mechanic/register', payload)
      localStorage.setItem('hh_token', token)
      login({ ...mechanic, role: 'mechanic' })
      navigate('/mechanic/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed.')
    }
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="text-xs text-slate-muted">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-asphalt-700 border border-asphalt-500 focus-ring focus:border-beacon text-sm"
      />
    </div>
  )

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl tracking-wide mb-1">Register as a Mechanic</h1>
      <p className="text-slate-muted text-sm mb-8">Your profile will be reviewed by our team before you go live.</p>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-signal-light text-sm">{error}</p>}
          {field('Full Name', 'name', 'text', 'Ramesh Kumar')}
          {field('Phone Number', 'phone', 'tel', '+91 90000 00000')}
          {field('Workshop / Garage Name (optional)', 'workshop', 'text', 'Kumar Auto Works')}
          <div>
            <label className="text-xs text-slate-muted">Primary Service</label>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-asphalt-700 border border-asphalt-500 text-sm focus-ring"
            >
              {services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          {field('Password', 'password', 'password', '••••••••')}
          <Button type="submit" full className="mt-2">Submit for Approval</Button>
        </form>
      </Card>
      <p className="text-center text-sm text-slate-muted mt-6">
        Already a partner? <Link to="/mechanic/login" className="text-beacon hover:underline">Login</Link>
      </p>
    </div>
  )
}
