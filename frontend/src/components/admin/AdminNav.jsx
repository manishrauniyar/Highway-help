import React from 'react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/admin/dashboard', label: 'Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/mechanics', label: 'Mechanics' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/complaints', label: 'Complaints' },
]

export default function AdminNav() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-asphalt-700">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-colors ${
              isActive ? 'border-beacon text-beacon' : 'border-transparent text-slate-muted hover:text-lane'
            }`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  )
}
