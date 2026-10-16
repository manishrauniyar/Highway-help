import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { MenuIcon, CloseIcon, UserIcon } from './Icons'
import Button from './Button'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-beacon' : 'text-slate-muted hover:text-lane'}`

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-asphalt-950/90 backdrop-blur border-b border-asphalt-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-wide">
          <span className="relative w-2.5 h-2.5 rounded-full bg-beacon inline-block">
            <span className="absolute inset-0 rounded-full bg-beacon animate-ping opacity-60" />
          </span>
          Highway<span className="text-beacon">-help</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/find-mechanic" className={navLinkClass}>Find a Mechanic</NavLink>
          {user?.role === 'customer' && <NavLink to="/bookings" className={navLinkClass}>My Bookings</NavLink>}
          {user?.role === 'mechanic' && <NavLink to="/mechanic/dashboard" className={navLinkClass}>Dashboard</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-sm text-slate-muted">
                <UserIcon size={16} /> {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-muted hover:text-lane">Login</Link>
              <Button as={Link} to="/register" size="sm">Get Help Now</Button>
            </>
          )}
        </div>

        <button className="md:hidden text-lane" onClick={() => setOpen(!open)}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-asphalt-700 bg-asphalt-900 px-4 py-4 flex flex-col gap-4">
          <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/find-mechanic" className={navLinkClass} onClick={() => setOpen(false)}>Find a Mechanic</NavLink>
          {user?.role === 'customer' && <NavLink to="/bookings" className={navLinkClass} onClick={() => setOpen(false)}>My Bookings</NavLink>}
          {user?.role === 'mechanic' && <NavLink to="/mechanic/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Admin</NavLink>}
          <div className="pt-2 border-t border-asphalt-700 flex flex-col gap-3">
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-muted hover:text-lane">Login</Link>
                <Button as={Link} to="/register" size="sm" onClick={() => setOpen(false)}>Get Help Now</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
