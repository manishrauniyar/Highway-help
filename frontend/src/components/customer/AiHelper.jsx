import React, { useState } from 'react'
import api, { getErrorMessage } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

const URGENCY_COLOR = { low: 'text-mint', medium: 'text-beacon', high: 'text-signal-light' }

export default function AiHelper({ onPickService }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  if (user?.role !== 'customer') return null

  const ask = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await api.post('/ai/diagnose', { description: text })
      setResult(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 rounded-2xl bg-asphalt-700 border border-asphalt-500 mb-6">
      <p className="font-semibold mb-1">Not sure what is wrong? Ask the AI assistant</p>
      <p className="text-xs text-slate-muted mb-3">Describe the problem and we will suggest the right service.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. my bike will not start and makes a clicking sound"
          className="flex-1 px-4 py-2.5 rounded-xl bg-asphalt-800 border border-asphalt-500 text-sm focus-ring"
        />
        <Button onClick={ask} disabled={loading || text.trim().length < 5}>{loading ? 'Thinking…' : 'Ask AI'}</Button>
      </div>

      {error && <p className="text-signal-light text-sm mt-3">{error}</p>}

      {result && (
        <div className="mt-4 text-sm">
          {result.callEmergency && (
            <p className="p-3 rounded-xl bg-signal/10 border border-signal/40 text-signal-light font-semibold mb-3">
              This sounds serious. Call 112 (emergency) right now.
            </p>
          )}
          <p><span className="text-slate-muted">Likely issue:</span> {result.likelyIssue}</p>
          <p className="mt-1">
            <span className="text-slate-muted">Urgency:</span>{' '}
            <span className={`font-semibold uppercase ${URGENCY_COLOR[result.urgency]}`}>{result.urgency}</span>
          </p>
          {result.tips.length > 0 && (
            <ul className="list-disc pl-5 mt-2 space-y-1">{result.tips.map((t) => <li key={t}>{t}</li>)}</ul>
          )}
          {result.serviceId && (
            <Button size="sm" className="mt-3" onClick={() => onPickService(result.serviceId)}>
              Show {result.serviceName} mechanics
            </Button>
          )}
          <p className="text-[11px] text-slate-muted mt-3">AI suggestion only, not a professional diagnosis.</p>
        </div>
      )}
    </div>
  )
}
