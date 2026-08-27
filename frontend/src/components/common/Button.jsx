import React from 'react'
import { classNames } from '../../utils/helpers'

const variants = {
  primary: 'bg-beacon text-asphalt-950 hover:bg-beacon-light active:bg-beacon-dark shadow-card',
  danger: 'bg-signal text-white hover:bg-signal-light',
  ghost: 'bg-transparent text-lane border border-asphalt-500 hover:border-beacon hover:text-beacon',
  outline: 'bg-transparent text-beacon border border-beacon hover:bg-beacon hover:text-asphalt-950',
  subtle: 'bg-asphalt-700 text-lane hover:bg-asphalt-600',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  children, variant = 'primary', size = 'md', className = '', as: As = 'button', full = false, disabled = false, ...rest
}) {
  return (
    <As
      disabled={disabled}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-150 focus-ring',
        variants[variant],
        sizes[size],
        full && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  )
}
