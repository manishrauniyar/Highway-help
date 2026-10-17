import React, { useEffect, useState } from 'react'
import { LocationIcon } from './Icons'
import { getCurrentLocation } from '../../utils/helpers'

// Used on Home with no props (fetches its own location).
// Used on Find Mechanic with location / loading / onRefresh so the page and map stay in sync.
export default function LocationBar({ className = '', location, loading: loadingProp, onRefresh }) {
  const controlled = onRefresh !== undefined
  const [own, setOwn] = useState(null)
  const [ownLoading, setOwnLoading] = useState(!controlled)

  const fetchOwn = async () => {
    setOwnLoading(true)
    setOwn(await getCurrentLocation())
    setOwnLoading(false)
  }

  useEffect(() => { if (!controlled) fetchOwn() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loc = controlled ? location : own
  const loading = controlled ? loadingProp : ownLoading
  const refresh = controlled ? onRefresh : fetchOwn

  return (
    <button
      onClick={refresh}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-full bg-asphalt-700/80 border border-asphalt-500/60 hover:border-beacon/60 transition-colors text-sm focus-ring ${className}`}
      title={loc?.address || 'Use my current location'}
    >
      <LocationIcon size={16} className="text-beacon shrink-0" />
      <span className="truncate max-w-[160px] sm:max-w-[220px] text-lane">
        {loading ? 'Locating you…' : loc?.label}
      </span>
    </button>
  )
}