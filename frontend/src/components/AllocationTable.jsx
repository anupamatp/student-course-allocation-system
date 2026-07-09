import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

const categoryStyles = {
  GENERAL: 'bg-slate-100 text-slate-600',
  OBC: 'bg-amber-50 text-amber-700',
  SC: 'bg-blue-50 text-blue-700',
  ST: 'bg-violet-50 text-violet-700',
}

const preferenceStyles = {
  1: 'bg-emerald-50 text-emerald-700',
  2: 'bg-blue-50 text-blue-700',
  3: 'bg-amber-50 text-amber-700',
}

export default function AllocationTable({ allocations, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[760px]">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide border-b border-slate-100">
            <th className="py-3 pr-4">Student</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Marks</th>
            <th className="py-3 pr-4">Allocated Course</th>
            <th className="py-3 pr-4">Preference</th>
            <th className="py-3 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((a, i) => (
            <motion.tr
              key={a.id ?? `${a.student_name}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.4) }}
              onClick={() => onRowClick?.(a)}
              className={`border-b border-slate-50 last:border-0 cursor-pointer transition-colors hover:bg-brand-50/40
                ${i % 2 === 1 ? 'bg-surface-50/60' : 'bg-white'}`}
            >
              <td className="py-3.5 pr-4 font-semibold text-slate-800">{a.student_name}</td>
              <td className="py-3.5 pr-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[a.category] || 'bg-slate-100 text-slate-600'}`}>
                  {a.category || '—'}
                </span>
              </td>
              <td className="py-3.5 pr-4 tabular-nums text-slate-600">
                {a.marks !== undefined && a.marks !== null ? Number(a.marks).toFixed(2) : '—'}
              </td>
              <td className="py-3.5 pr-4 text-slate-600">{a.course_name || '—'}</td>
              <td className="py-3.5 pr-4">
                {a.allocated_preference ? (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${preferenceStyles[a.allocated_preference] || 'bg-slate-100 text-slate-600'}`}>
                    Preference {a.allocated_preference}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="py-3.5 pr-4">
                {a.status === 'ALLOCATED' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Allocated
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                    <XCircle className="w-3.5 h-3.5" /> Not Allocated
                  </span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}