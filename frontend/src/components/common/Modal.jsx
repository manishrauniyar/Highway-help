import React, { useEffect } from 'react'
import { CloseIcon } from './Icons'

export default function Modal({ open, onClose, title, children, hideClose = false }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !hideClose) onClose && onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, hideClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!hideClose ? onClose : undefined} />
      <div className="relative w-full sm:max-w-md bg-asphalt-800 border border-asphalt-600 rounded-t-3xl sm:rounded-3xl p-6 shadow-pop animate-[fadeIn_.2s_ease]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg tracking-wide">{title}</h3>
          {!hideClose && (
            <button onClick={onClose} className="p-1 text-slate-muted hover:text-lane focus-ring rounded">
              <CloseIcon size={20} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
