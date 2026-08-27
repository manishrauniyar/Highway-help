import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-asphalt-700 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="font-display text-lg tracking-wide mb-2">Highway<span className="text-beacon">-help</span></div>
          <p className="text-slate-muted">Vehicle breakdown? Help is nearby, day or night.</p>
        </div>
        <div>
          <h4 className="text-lane font-semibold mb-3">Customer</h4>
          <ul className="space-y-2 text-slate-muted">
            <li><Link to="/find-mechanic" className="hover:text-beacon">Find a Mechanic</Link></li>
            <li><Link to="/bookings" className="hover:text-beacon">Booking History</Link></li>
            <li><Link to="/register" className="hover:text-beacon">Create Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lane font-semibold mb-3">Partner</h4>
          <ul className="space-y-2 text-slate-muted">
            <li><Link to="/mechanic/register" className="hover:text-beacon">Register as Mechanic</Link></li>
            <li><Link to="/mechanic/login" className="hover:text-beacon">Mechanic Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lane font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-slate-muted">
            <li><Link to="/admin/login" className="hover:text-beacon">Admin Portal</Link></li>
            <li><span className="text-slate-muted">Emergency: 1800-XXX-XXXX</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-asphalt-700 py-4 text-center text-xs text-slate-muted">
        © {new Date().getFullYear()} Highway-help. Built for riders and drivers who never want to be stranded.
      </div>
    </footer>
  )
}
