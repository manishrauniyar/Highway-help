import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../utils/api'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

export default function Register() {
  const { customerRegister } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicle: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await customerRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        vehicle: form.vehicle.trim(),
        password: form.password,
      })
      navigate('/find-mechanic')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
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
      <h1 className="font-display text-3xl tracking-wide mb-1">Create your account</h1>
      <p className="text-slate-muted text-sm mb-8">It only takes a minute to get roadside help ready.</p>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-signal-light text-sm">{error}</p>}
          {field('Full Name', 'name', 'text', 'Aditya Sharma')}
          {field('Email', 'email', 'email', 'you@example.com')}
          {field('Phone Number', 'phone', 'tel', '+91 90000 00000')}
          {field('Vehicle (optional)', 'vehicle', 'text', 'Bike - Pulsar 150')}
          {field('Password', 'password', 'password', '••••••••')}
          <Button type="submit" full className="mt-2" disabled={loading}>{loading ? 'Creating account…' : 'Create Account'}</Button>
        </form>
      </Card>
      <p className="text-center text-sm text-slate-muted mt-6">
        Already have an account? <Link to="/login" className="text-beacon hover:underline">Login</Link>
      </p>
    </div>
  )
}
