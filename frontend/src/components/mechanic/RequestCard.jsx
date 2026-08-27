import React from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import { LocationIcon, PhoneIcon } from '../common/Icons'
import { formatDate } from '../../utils/helpers'

export default function RequestCard({ booking, onAccept, onReject }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display tracking-wide">{booking.customerName}</h4>
          <p className="text-xs text-slate-muted mt-0.5">{formatDate(booking.createdAt)}</p>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-beacon/20 text-beacon border border-beacon/40">
          {booking.serviceType}
        </span>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-muted">
        <span className="flex items-center gap-1"><LocationIcon size={13} /> {booking.locationLabel || 'Nearby location'}</span>
        <span className="flex items-center gap-1"><PhoneIcon size={13} /> {booking.customerPhone}</span>
      </div>
      <div className="flex gap-3 mt-4">
        <Button size="sm" variant="danger" className="flex-1" onClick={() => onReject(booking.id)}>Reject</Button>
        <Button size="sm" variant="primary" className="flex-1" onClick={() => onAccept(booking.id)}>Accept</Button>
      </div>
    </Card>
  )
}
