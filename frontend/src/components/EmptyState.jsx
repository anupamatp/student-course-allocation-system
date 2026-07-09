import { Inbox } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EmptyState({ title = 'Nothing here yet', message, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
        <Inbox className="w-7 h-7 text-slate-300" strokeWidth={1.75} />
      </div>
      <h3 className="font-display font-semibold text-slate-800 text-sm">{title}</h3>
      {message && <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">{message}</p>}
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-soft"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}