import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Users, BookOpen, Armchair, DoorOpen, GraduationCap, XCircle, Target, FileCheck2, RefreshCw,
} from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import { CategoryPieChart, SeatUtilizationChart, AllocationDonutChart } from '../components/DashboardCharts.jsx'
import CourseOverviewTable from '../components/CourseOverviewTable.jsx'
import TopStudentsTable from '../components/TopStudentsTable.jsx'
import {
  RecentActivityCard, QuickActionsCard, SystemStatusCard, InsightsCard, NotificationBanner,
} from '../components/DashboardWidgets.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { TableSkeleton } from '../components/LoadingSpinner.jsx'
import { getDashboardStats, getStudents, getCourses, getAllocations } from '../services/api.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState(null)

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const [statsRes, studentsRes, coursesRes, allocationsRes] = await Promise.all([
        getDashboardStats(),
        getStudents({ limit: 1000 }),
        getCourses(),
        getAllocations(),
      ])
      setStats(statsRes.data)
      setStudents(studentsRes.data)
      setCourses(coursesRes.data)
      setAllocations(allocationsRes.data)
      if (isRefresh) showToast('Dashboard refreshed successfully.')
    } catch {
      showToast('Could not load dashboard data. Is the backend running?')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const hasRun = allocations.length > 0
  const totalProcessed = stats ? stats.allocated_students + stats.not_allocated_students : 0

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100 h-20 animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100">
          <TableSkeleton rows={6} cols={5} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-600 to-accent-600 rounded-xl2 p-6 shadow-card text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-display font-bold">Welcome back 👋</h2>
          <p className="text-sm text-white/80 mt-1">Student Course Allocation System — everything is running smoothly.</p>
        </div>
        <div className="text-right sm:text-right">
          <p className="text-xs text-white/70 font-medium">{today}</p>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-display font-bold text-slate-900">Dashboard</h2>
          <p className="text-xs text-slate-400 font-medium">Overview of the Student Course Allocation System.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-surface-100 disabled:opacity-60 transition-colors whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Dashboard'}
        </motion.button>
      </div>

      <NotificationBanner
        noStudents={students.length === 0}
        noCourses={courses.length === 0}
        notRun={!hasRun}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={stats?.total_students ?? 0} tone="brand" />
        <StatCard icon={BookOpen} label="Total Courses" value={stats?.total_courses ?? 0} tone="blue" />
        <StatCard icon={Armchair} label="Total Seats" value={stats?.total_seats ?? 0} tone="slate" />
        <StatCard icon={DoorOpen} label="Remaining Seats" value={stats?.remaining_seats ?? 0} tone="amber" />
        <StatCard icon={GraduationCap} label="Allocated Students" value={stats?.allocated_students ?? 0} tone="emerald" />
        <StatCard icon={XCircle} label="Not Allocated Students" value={stats?.not_allocated_students ?? 0} tone="rose" />
        <StatCard
          icon={Target} label="Allocation Success Rate"
          value={totalProcessed ? Math.round(((stats?.allocated_students ?? 0) / totalProcessed) * 100) : 0}
          suffix="%" tone="violet"
        />
        <StatCard icon={FileCheck2} label="Applications Processed" value={totalProcessed} tone="brand" />
      </div>

      {students.length === 0 || courses.length === 0 ? (
        <div className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100">
          <EmptyState
            title={students.length === 0 ? 'No students available.' : 'No courses available.'}
            message="Add some data to unlock dashboard analytics."
          />
        </div>
      ) : !hasRun ? (
        <div className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100">
          <EmptyState title="Run Allocation to see dashboard analytics." />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CategoryPieChart students={students} />
          <SeatUtilizationChart courses={courses} allocations={allocations} />
          <AllocationDonutChart allocations={allocations} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
        >
          <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">Course Overview</h3>
          {courses.length === 0 ? (
            <EmptyState title="No courses available." />
          ) : (
            <CourseOverviewTable courses={courses} />
          )}
        </motion.div>
        <RecentActivityCard students={students} courses={courses} hasRun={hasRun} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
        >
          <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">Top Students</h3>
          {students.length === 0 ? (
            <EmptyState title="No students available." />
          ) : (
            <TopStudentsTable students={students} />
          )}
        </motion.div>
        <InsightsCard courses={courses} allocations={allocations} students={students} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <QuickActionsCard />
        <SystemStatusCard studentsLoaded={students.length > 0} coursesLoaded={courses.length > 0} />
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-card z-[70]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}