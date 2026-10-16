import React from 'react'

export default function DataTable({ columns, rows, emptyLabel = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-asphalt-600/60">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-asphalt-700/60 text-left text-slate-muted uppercase text-[11px] tracking-wide">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold whitespace-nowrap">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-slate-muted">{emptyLabel}</td></tr>
          )}
          {rows.map((row, idx) => (
            <tr key={row.id || idx} className="border-t border-asphalt-700 hover:bg-asphalt-700/30">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 whitespace-nowrap">{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
