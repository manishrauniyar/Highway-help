import React from 'react'
import Card from '../common/Card'

export default function StatCard({ label, value, icon: Icon, accent = 'text-beacon' }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      {Icon && (
        <div className={`w-11 h-11 rounded-xl bg-asphalt-700 flex items-center justify-center ${accent}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-2xl font-display tracking-wide">{value}</p>
        <p className="text-xs text-slate-muted mt-0.5">{label}</p>
      </div>
    </Card>
  )
}
