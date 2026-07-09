import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, ListChecks, GraduationCap, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/allocation', label: 'Allocation', icon: ListChecks },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-slate-100 z-50
          flex flex-col transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-soft">
              <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.25} />
            </div>
            <div className="leading-tight">
              <p className="font-display font-bold text-slate-900 text-sm">Course Allocation</p>
              <p className="text-[11px] text-slate-400 font-medium">Admin Console</p>
            </div>
          </div>

          {/* Explicit type="button" + higher z-index + relative positioning to guarantee clickability */}
          <button
            type="button"
            onClick={() => onClose()}
            className="lg:hidden relative z-[60] text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-100"
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-card'
                    : 'text-slate-500 hover:bg-surface-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'
                    }`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mx-3 mb-4 rounded-xl2 bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100">
          <p className="text-xs font-semibold text-slate-700">Allocation Engine</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Marks-first, category-aware seat matching.
          </p>
        </div>
      </aside>
    </>
  )
}