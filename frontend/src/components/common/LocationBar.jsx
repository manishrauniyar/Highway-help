import React, { useEffect, useState } from 'react'
import { LocationIcon } from './Icons'
import { getCurrentLocation } from '../../utils/helpers'

export default function LocationBar({ className = '' }) {
  const [loc, setLoc] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchLocation = async () => {
    setLoading(true)
    const result = await getCurrentLocation()
    setLoc(result)
    setLoading(false)
  }

  useEffect(() => { fetchLocation() }, [])

  return (
    <button
      onClick={fetchLocation}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-full bg-asphalt-700/80 border border-asphalt-500/60 hover:border-beacon/60 transition-colors text-sm focus-ring ${className}`}
      title="Refresh location"
    >
      <LocationIcon size={16} className="text-beacon shrink-0" />
      <span className="truncate max-w-[160px] sm:max-w-[220px] text-lane">
        {loading ? 'Locating you…' : loc?.label}
      </span>
    </button>
  )
}
