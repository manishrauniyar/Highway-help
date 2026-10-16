import React from 'react'
import { STATUS_FLOW, STATUS_LABELS } from '../../context/BookingContext'
import { CheckIcon } from '../common/Icons'

export default function BookingStatusTracker({ status }) {
  const currentIndex = STATUS_FLOW.indexOf(status)
  const isTerminalIssue = status === 'cancelled' || status === 'rejected'

  if (isTerminalIssue) {
    return (
      <div className="text-center py-4">
        <p className="text-signal-light font-semibold">{STATUS_LABELS[status]}</p>
      </div>
    )
  }

  return (
    <div className="flex items-start">
      {STATUS_FLOW.map((step, idx) => {
        const done = idx <= currentIndex
        const isLast = idx === STATUS_FLOW.length - 1
        return (
          <div key={step} className="flex-1 flex flex-col items-center relative">
            <div className="flex items-center w-full">
              <div className={`flex-1 h-[2px] ${idx === 0 ? 'opacity-0' : done ? 'bg-beacon' : 'bg-asphalt-600'}`} />
              <div
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center border-2 z-10 ${
                  done ? 'bg-beacon border-beacon text-asphalt-950' : 'bg-asphalt-800 border-asphalt-600 text-slate-muted'
                }`}
              >
                {done ? <CheckIcon size={14} /> : <span className="text-[10px]">{idx + 1}</span>}
              </div>
              <div className={`flex-1 h-[2px] ${isLast ? 'opacity-0' : idx < currentIndex ? 'bg-beacon' : 'bg-asphalt-600'}`} />
            </div>
            <span className={`mt-2 text-[10px] sm:text-xs text-center leading-tight ${done ? 'text-lane' : 'text-slate-muted'}`}>
              {STATUS_LABELS[step]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
