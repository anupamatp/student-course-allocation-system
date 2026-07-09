import { AnimatePresence, motion } from 'framer-motion'
import { X, User, BookOpen, Award, Calendar, ListOrdered } from 'lucide-react'

const categoryStyles = {
  GENERAL: 'bg-slate-100 text-slate-600',
  OBC: 'bg-amber-50 text-amber-700',
  SC: 'bg-blue-50 text-blue-700',
  ST: 'bg-violet-50 text-violet-700',
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  )
}

export default function AllocationDrawer({ open, onClose, record }) {
  return (
    <AnimatePresence>
      {open && record && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white z-[80] shadow-card p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-slate-900">Student Details</h3>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-100">
                <X className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white font-display font-bold">
                {record.student_name?.[0] || '?'}
              </div>
              <div>
                <p className="font-display font-bold text-slate-900">{record.student_name}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${categoryStyles[record.category] || 'bg-slate-100 text-slate-600'}`}>
                  {record.category}
                </span>
              </div>
            </div>

            <div className="bg-surface-50 rounded-xl2 px-4">
              <Row icon={Award} label="Marks" value={record.marks?.toFixed?.(2) ?? record.marks} />
              <Row icon={BookOpen} label="Allocated Course" value={record.course_name || 'Not Allocated'} />
              <Row icon={ListOrdered} label="Preference" value={record.allocated_preference ? `Preference ${record.allocated_preference}` : '—'} />
              <Row icon={User} label="Allocation Status" value={record.status === 'ALLOCATED' ? 'Allocated' : 'Not Allocated'} />
              <Row icon={Calendar} label="Application Date" value={record.application_date} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}