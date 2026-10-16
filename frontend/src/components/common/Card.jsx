import React from 'react'
import { classNames } from '../../utils/helpers'

export default function Card({ children, className = '', ...rest }) {
  return (
    <div className={classNames('rounded-2xl bg-asphalt-800 border border-asphalt-600/60 shadow-card', className)} {...rest}>
      {children}
    </div>
  )
}
