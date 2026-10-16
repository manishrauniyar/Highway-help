import React from 'react'
import Card from '../common/Card'
import { FuelIcon, ClockIcon, LocationIcon } from '../common/Icons'
import { formatDistance } from '../../utils/helpers'

export default function PetrolPumpCard({ pump }) {
  return (
    <Card className="p-4 flex gap-3 items-start">
      <div className="w-11 h-11 rounded-xl bg-mint/15 text-mint flex items-center justify-center shrink-0">
        <FuelIcon size={20} />
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-sm truncate">{pump.name}</h4>
        <p className="text-xs text-slate-muted mt-0.5 truncate">{pump.address}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-muted">
          <span className="flex items-center gap-1"><LocationIcon size={12} /> {formatDistance(pump.distanceKm)}</span>
          <span className="flex items-center gap-1"><ClockIcon size={12} /> {pump.open24Hours ? 'Open 24 hrs' : 'Timed hours'}</span>
        </div>
        <div className="flex gap-1.5 mt-2">
          {pump.fuels.map((f) => (
            <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-asphalt-700 text-slate-muted">{f}</span>
          ))}
        </div>
      </div>
    </Card>
  )
}
