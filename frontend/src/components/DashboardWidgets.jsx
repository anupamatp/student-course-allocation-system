import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus, BookPlus, PlayCircle, ListChecks, CheckCircle2, AlertTriangle,
  Server, Database, Cpu, Users, BookOpen,
} from 'lucide-react'

export function RecentActivityCard({ students, courses, hasRun }) {
  const recentStudents = [...students].sort((a, b) => b.id - a.id).slice(0, 2)
  const recentCourses = [...courses].sort((a, b) => b.id - a.id).slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
    >
      <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {recentStudents.map((s) => (
          <div key={`s-${s.id}`} className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">👤</span>
            <p className="text-slate-600"><span className="font-semibold text-slate-800">{s.name}</span> added</p>
          </div>
        ))}
        {recentCourses.map((c) => (
          <div key={`c-${c.id}`} className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center shrink-0">📘</span>
            <p className="text-slate-600"><span className="font-semibold text-slate-800">{c.name}</span> created</p>
          </div>
        ))}
        {hasRun && (
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">🎯</span>
            <p className="text-slate-600">Allocation completed</p>
          </div>
        )}
        {recentStudents.length === 0 && recentCourses.length === 0 && !hasRun && (
          <p className="text-xs text-slate-400">No activity yet.</p>
        )}
      </div>
    </motion.div>
  )
}

export function QuickActionsCard() {
  const navigate = useNavigate()
  const actions = [
    { label: 'Add Student', icon: UserPlus, path: '/students', tone: 'bg-brand-50 text-brand-600' },
    { label: 'Add Course', icon: BookPlus, path: '/courses', tone: 'bg-accent-50 text-accent-600' },
    { label: 'Run Allocation', icon: PlayCircle, path: '/allocation', tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'View Allocation', icon: ListChecks, path: '/allocation', tone: 'bg-blue-50 text-blue-600' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
    >
      <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ label, icon: Icon, path, tone }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate(path)}
            className="flex flex-col items-start gap-2 p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-surface-50 transition-colors text-left"
          >
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone}`}>
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-slate-700">{label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function SystemStatusCard({ studentsLoaded, coursesLoaded }) {
  const items = [
    { label: 'Database Connected', icon: Database },
    { label: 'Backend Online', icon: Server },
    { label: 'Allocation Engine Ready', icon: Cpu },
    { label: 'Students Loaded', icon: Users, ok: studentsLoaded },
    { label: 'Courses Loaded', icon: BookOpen, ok: coursesLoaded },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
    >
      <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">System Status</h3>
      <div className="space-y-2.5">
        {items.map(({ label, icon: Icon, ok = true }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">{label}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              ok ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <CheckCircle2 className="w-3 h-3" /> {ok ? 'OK' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function InsightsCard({ courses, allocations, students }) {
  const allocatedByCourse = {}
  allocations.forEach((a) => {
    if (a.status === 'ALLOCATED' && a.course_name) {
      allocatedByCourse[a.course_name] = (allocatedByCourse[a.course_name] || 0) + 1
    }
  })
  const mostPreferred = Object.entries(allocatedByCourse).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const categoryCounts = {}
  students.forEach((s) => { categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1 })
  const highestDemand = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const allocatedCount = allocations.filter((a) => a.status === 'ALLOCATED').length
  const successRate = allocations.length ? Math.round((allocatedCount / allocations.length) * 100) : 0

  const mostRemaining = [...courses].sort((a, b) => {
    const remA = (a.remaining_general_seats ?? 0) + (a.remaining_obc_seats ?? 0) + (a.remaining_sc_seats ?? 0) + (a.remaining_st_seats ?? 0)
    const remB = (b.remaining_general_seats ?? 0) + (b.remaining_obc_seats ?? 0) + (b.remaining_sc_seats ?? 0) + (b.remaining_st_seats ?? 0)
    return remB - remA
  })[0]?.name ?? '—'

  const avgMarks = students.length
    ? (students.reduce((sum, s) => sum + Number(s.marks), 0) / students.length).toFixed(2)
    : '0.00'

  const rows = [
    ['Most Preferred Course', mostPreferred],
    ['Highest Demand Category', highestDemand],
    ['Allocation Success %', `${successRate}%`],
    ['Course with Most Remaining Seats', mostRemaining],
    ['Average Student Marks', avgMarks],
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
    >
      <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">Allocation Insights</h3>
      <div className="space-y-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
            <span className="text-xs font-medium text-slate-400">{label}</span>
            <span className="text-sm font-semibold text-slate-800">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function NotificationBanner({ noStudents, noCourses, notRun }) {
  if (!noStudents && !noCourses && !notRun) return null

  const messages = []
  if (noStudents) messages.push('No students available.')
  if (noCourses) messages.push('No courses available.')
  if (notRun) messages.push('Allocation has not been run yet.')

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3"
    >
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <div className="space-y-0.5">
        {messages.map((m) => (
          <p key={m} className="text-sm text-amber-800 font-medium">{m}</p>
        ))}
      </div>
    </motion.div>
  )
}