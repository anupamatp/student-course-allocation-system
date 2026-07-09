import { Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const badgeStyles = {
  general: 'bg-slate-100 text-slate-600',
  obc: 'bg-amber-50 text-amber-700',
  sc: 'bg-blue-50 text-blue-700',
  st: 'bg-violet-50 text-violet-700',
  remaining: 'bg-emerald-50 text-emerald-700',
}

function Badge({ type, value }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[type]}`}>
      {value}
    </span>
  )
}

export default function CourseTable({ courses, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide border-b border-slate-100 sticky top-0 bg-white">
            <th className="py-3 pr-4">ID</th>
            <th className="py-3 pr-4">Course Name</th>
            <th className="py-3 pr-4">Total Seats</th>
            <th className="py-3 pr-4">General</th>
            <th className="py-3 pr-4">OBC</th>
            <th className="py-3 pr-4">SC</th>
            <th className="py-3 pr-4">ST</th>
            <th className="py-3 pr-4">Remaining</th>
            <th className="py-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <motion.tr
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              className="border-b border-slate-50 last:border-0 hover:bg-surface-50 transition-colors"
            >
              <td className="py-3.5 pr-4 text-slate-400 font-medium">#{c.id}</td>
              <td className="py-3.5 pr-4 font-semibold text-slate-800">{c.name}</td>
              <td className="py-3.5 pr-4 tabular-nums text-slate-600">{c.total_seats}</td>
              <td className="py-3.5 pr-4"><Badge type="general" value={c.general_seats} /></td>
              <td className="py-3.5 pr-4"><Badge type="obc" value={c.obc_seats} /></td>
              <td className="py-3.5 pr-4"><Badge type="sc" value={c.sc_seats} /></td>
              <td className="py-3.5 pr-4"><Badge type="st" value={c.st_seats} /></td>
              <td className="py-3.5 pr-4"><Badge type="remaining" value={c.remaining_seats} /></td>
              <td className="py-3.5 pr-4">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    title="Edit"
                    onClick={() => onEdit(c)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => onDelete(c)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}