import React from 'react'
import { STATUS_LABELS } from '../../context/BookingContext'
import { classNames } from '../../utils/helpers'

const styles = {
  requested: 'bg-asphalt-600 text-lane',
  accepted: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  onway: 'bg-beacon/20 text-beacon border border-beacon/50',
  arrived: 'bg-beacon/30 text-beacon-light border border-beacon/60',
  started: 'bg-mint/20 text-mint border border-mint/50',
  completed: 'bg-mint/20 text-mint border border-mint/50',
  cancelled: 'bg-signal/20 text-signal-light border border-signal/40',
  rejected: 'bg-signal/20 text-signal-light border border-signal/40',
}

export default function StatusBadge({ status, className = '' }) {
  return (
    <span className={classNames('px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide', styles[status] || styles.requested, className)}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
