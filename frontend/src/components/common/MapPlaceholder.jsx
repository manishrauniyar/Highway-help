import React from 'react'
import { LocationIcon, WrenchIcon } from './Icons'

export default function MapPlaceholder({ mode = 'searching', etaMin, mechanicName, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-road border border-asphalt-600/60 ${className}`}>
      {/* road grid backdrop */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-x-0 top-1/2 dash-line opacity-60" />
      <div className="absolute inset-y-0 left-1/2 w-[2px] bg-asphalt-500/30" />

      <div className="relative flex flex-col items-center justify-center h-full py-10">
        {mode === 'tracking' && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-muted">
            <div className="w-9 h-9 rounded-full bg-asphalt-700 border border-beacon/60 flex items-center justify-center text-beacon">
              <WrenchIcon size={16} />
            </div>
            <span className="text-[11px] mt-1">{mechanicName}</span>
          </div>
        )}

        {/* user beacon */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-16 w-16 rounded-full bg-beacon/40 animate-pulseRing" />
          <span className="absolute inline-flex h-16 w-16 rounded-full bg-beacon/40 animate-pulseRing [animation-delay:0.6s]" />
          <div className="relative w-11 h-11 rounded-full bg-beacon flex items-center justify-center shadow-pop text-asphalt-950">
            <LocationIcon size={22} />
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-muted font-medium tracking-wide">
          {mode === 'searching' ? 'Scanning nearby mechanics…' : `Mechanic is ${etaMin} min away`}
        </p>
      </div>
    </div>
  )
}
