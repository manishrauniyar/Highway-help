import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../utils/api'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

export default function Login() {
  const { customerLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter both email and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await customerLogin(form.email.trim(), form.password)
      navigate('/find-mechanic')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl tracking-wide mb-1">Welcome back</h1>
      <p className="text-slate-muted text-sm mb-8">Login to book and track roadside assistance.</p>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-signal-light text-sm">{error}</p>}
          <div>
            <label className="text-xs text-slate-muted">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
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
        New to Highway-help? <Link to="/register" className="text-beacon hover:underline">Create an account</Link>
      </p>
      <p className="text-center text-xs text-slate-muted mt-3">
        Are you a mechanic? <Link to="/mechanic/login" className="text-beacon hover:underline">Partner login</Link>
      </p>
    </div>
  )
}
