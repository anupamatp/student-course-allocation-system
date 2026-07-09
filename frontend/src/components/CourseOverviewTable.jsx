import { motion } from 'framer-motion'

export default function CourseOverviewTable({ courses }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide border-b border-slate-100 sticky top-0 bg-white">
            <th className="py-3 pr-4">Course</th>
            <th className="py-3 pr-4">Total Seats</th>
            <th className="py-3 pr-4">Remaining Seats</th>
            <th className="py-3 pr-4">Occupancy</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => {
            const remaining =
              (c.remaining_general_seats ?? 0) +
              (c.remaining_obc_seats ?? 0) +
              (c.remaining_sc_seats ?? 0) +
              (c.remaining_st_seats ?? 0)
            const occupancy = c.total_seats
              ? Math.round(((c.total_seats - remaining) / c.total_seats) * 100)
              : 0

            return (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="border-b border-slate-50 last:border-0 hover:bg-surface-50 transition-colors"
              >
                <td className="py-3.5 pr-4 font-semibold text-slate-800">{c.name}</td>
                <td className="py-3.5 pr-4 tabular-nums text-slate-600">{c.total_seats}</td>
                <td className="py-3.5 pr-4 tabular-nums text-slate-600">{remaining}</td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5 min-w-[140px]">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${occupancy}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-600 to-accent-600"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 tabular-nums w-9">{occupancy}%</span>
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}