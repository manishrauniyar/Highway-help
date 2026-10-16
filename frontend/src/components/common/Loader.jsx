import React from 'react'

export default function Loader({ label = 'Loading…', full = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${full ? 'min-h-[60vh]' : 'py-10'}`}>
      <div className="w-9 h-9 rounded-full border-2 border-asphalt-500 border-t-beacon animate-spin" />
      <p className="text-sm text-slate-muted">{label}</p>
    </div>
  )
}
