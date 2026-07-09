import { Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const categoryStyles = {
  GENERAL: 'bg-slate-100 text-slate-600',
  OBC: 'bg-amber-50 text-amber-700',
  SC: 'bg-blue-50 text-blue-700',
  ST: 'bg-violet-50 text-violet-700',
}

export default function StudentTable({ students, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide border-b border-slate-100">
            <th className="py-3 pr-4">ID</th>
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Marks</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Application Date</th>
            <th className="py-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <motion.tr
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              className="border-b border-slate-50 last:border-0 hover:bg-surface-50 transition-colors"
            >
              <td className="py-3.5 pr-4 text-slate-400 font-medium">#{s.id}</td>
              <td className="py-3.5 pr-4 font-semibold text-slate-800">{s.name}</td>
              <td className="py-3.5 pr-4 tabular-nums text-slate-600">{Number(s.marks).toFixed(2)}</td>
              <td className="py-3.5 pr-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[s.category] || 'bg-slate-100 text-slate-600'}`}>
                  {s.category}
                </span>
              </td>
              <td className="py-3.5 pr-4 text-slate-500">{s.application_date}</td>
              <td className="py-3.5 pr-4">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onEdit(s)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(s)}
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