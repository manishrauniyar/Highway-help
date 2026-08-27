import React, { useState } from 'react'
import { StarIcon } from './Icons'

export default function RatingStars({ value = 0, onChange, size = 18, readOnly = false }) {
  const [hover, setHover] = useState(0)
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => {
        const filled = (hover || value) >= s
        return (
          <button
            key={s}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(s)}
            onMouseEnter={() => !readOnly && setHover(s)}
            onMouseLeave={() => !readOnly && setHover(0)}
            className={readOnly ? 'cursor-default' : 'cursor-pointer focus-ring rounded'}
          >
            <StarIcon size={size} filled={filled} className={filled ? 'text-beacon' : 'text-asphalt-400'} />
          </button>
        )
      })}
    </div>
  )
}
