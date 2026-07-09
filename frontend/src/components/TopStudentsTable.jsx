import { motion } from 'framer-motion'

const categoryStyles = {
  GENERAL: 'bg-slate-100 text-slate-600',
  OBC: 'bg-amber-50 text-amber-700',
  SC: 'bg-blue-50 text-blue-700',
  ST: 'bg-violet-50 text-violet-700',
}

const rankStyles = ['bg-amber-400', 'bg-slate-300', 'bg-amber-700', 'bg-slate-200', 'bg-slate-200']

export default function TopStudentsTable({ students }) {
  const top5 = [...students].sort((a, b) => b.marks - a.marks).slice(0, 5)

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide border-b border-slate-100">
          <th className="py-3 pr-4">Rank</th>
          <th className="py-3 pr-4">Name</th>
          <th className="py-3 pr-4">Marks</th>
          <th className="py-3 pr-4">Category</th>
        </tr>
      </thead>
      <tbody>
        {top5.map((s, i) => (
          <motion.tr
            key={s.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="border-b border-slate-50 last:border-0 hover:bg-surface-50 transition-colors"
          >
            <td className="py-3.5 pr-4">
              <span className={`w-6 h-6 rounded-full ${rankStyles[i]} text-white text-xs font-bold flex items-center justify-center`}>
                {i + 1}
              </span>
            </td>
            <td className="py-3.5 pr-4 font-semibold text-slate-800">{s.name}</td>
            <td className="py-3.5 pr-4 tabular-nums text-slate-600">{Number(s.marks).toFixed(2)}</td>
            <td className="py-3.5 pr-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[s.category] || 'bg-slate-100 text-slate-600'}`}>
                {s.category}
              </span>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  )
}