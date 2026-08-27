import React from 'react'
import { Link } from 'react-router-dom'
import { iconMap } from '../common/Icons'

export default function ServiceCard({ service }) {
  const Icon = iconMap[service.icon]
  return (
    <Link
      to={`/find-mechanic?service=${service.id}`}
      className="group flex flex-col gap-3 p-5 rounded-2xl bg-asphalt-800 border border-asphalt-600/60 hover:border-beacon/60 hover:-translate-y-1 transition-all duration-200"
    >
      <div className="w-11 h-11 rounded-xl bg-beacon/15 text-beacon flex items-center justify-center group-hover:bg-beacon group-hover:text-asphalt-950 transition-colors">
        {Icon && <Icon size={22} />}
      </div>
      <div>
        <h3 className="font-display text-base tracking-wide">{service.name}</h3>
        <p className="text-sm text-slate-muted mt-0.5">{service.desc}</p>
      </div>
    </Link>
  )
}
