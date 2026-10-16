import React, { useRef } from 'react'

export default function OTPInput({ length = 4, value, onChange }) {
  const refs = useRef([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const handleChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = digits.slice()
    next[idx] = val
    onChange(next.join(''))
    if (val && idx < length - 1) refs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) refs.current[idx - 1]?.focus()
  }

  return (
    <div className="flex items-center gap-3 justify-center">
      {digits.map((d, idx) => (
        <input
          key={idx}
          ref={(el) => (refs.current[idx] = el)}
          value={d}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-14 text-center text-2xl font-mono bg-asphalt-700 border border-asphalt-500 rounded-xl focus-ring focus:border-beacon text-lane"
        />
      ))}
    </div>
  )
}
