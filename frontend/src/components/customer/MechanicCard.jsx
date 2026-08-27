import React from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../common/RatingStars'
import Card from '../common/Card'
import Button from '../common/Button'
import { ShieldIcon, ClockIcon, LocationIcon } from '../common/Icons'
import { formatDistance } from '../../utils/helpers'

export default function MechanicCard({ mechanic }) {
  const district = mechanic.district

  return (
    <Card className="p-4 flex gap-4 items-start">
      <img src={mechanic.photo} alt={mechanic.name} className="w-16 h-16 rounded-xl object-cover border border-asphalt-600" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-base tracking-wide truncate">{mechanic.name}</h3>
          {mechanic.verified && (
            <span className="flex items-center gap-1 text-xs text-mint shrink-0">
              <ShieldIcon size={14} /> Verified
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <RatingStars value={Math.round(mechanic.rating)} readOnly size={14} />
          <span className="text-slate-muted">{mechanic.rating} ({mechanic.reviewsCount})</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-muted">
          <span className="flex items-center gap-1"><LocationIcon size={13} /> {formatDistance(mechanic.distanceKm)} away</span>
          <span className="flex items-center gap-1"><ClockIcon size={13} /> ETA {mechanic.etaMin} min</span>
        </div>
        {district && (
          <p className="text-xs text-beacon mt-1.5 truncate">
            {district.name} · {district.highways.slice(0, 2).join(', ')}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {mechanic.services.map((s) => (
            <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-asphalt-700 text-slate-muted">{s}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs font-semibold ${mechanic.available ? 'text-mint' : 'text-signal-light'}`}>
            {mechanic.available ? '● Available now' : '● Currently busy'}
          </span>
          <Button as={Link} to={`/mechanic-details/${mechanic.id}`} size="sm" variant={mechanic.available ? 'primary' : 'subtle'}>
            View
          </Button>
        </div>
      </div>
    </Card>
  )
}
