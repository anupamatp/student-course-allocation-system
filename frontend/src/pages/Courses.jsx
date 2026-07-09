import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, BookOpen, Armchair, DoorOpen, CheckCircle2 } from 'lucide-react'
import SearchBar from '../components/SearchBar.jsx'
import CourseTable from '../components/CourseTable.jsx'
import CourseModal from '../components/CourseModal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { TableSkeleton } from '../components/LoadingSpinner.jsx'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api.js'

// Normalizes whatever shape the backend sends into the fields the table/cards need.
// Adjust this one function if your API's field names differ.
function normalize(course) {
  const general = course.general_seats ?? 0
  const obc = course.obc_seats ?? 0
  const sc = course.sc_seats ?? 0
  const st = course.st_seats ?? 0
  const remaining =
    course.remaining_seats ?? course.total_seats - (course.allocated_count ?? 0)
  return { ...course, general_seats: general, obc_seats: obc, sc_seats: sc, st_seats: st, remaining_seats: remaining }
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100 flex items-center gap-4"
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-soft shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-xl font-display font-bold text-slate-900 tabular-nums">{value}</p>
      </div>
    </motion.div>
  )
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState(null)

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  async function load() {
    setLoading(true)
    try {
      const res = await getCourses()
      setCourses(res.data.map(normalize))
      setErrorMsg('')
    } catch {
      setErrorMsg('Could not load courses. Is the backend running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = courses.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const totals = {
    totalCourses: courses.length,
    totalSeats: courses.reduce((sum, c) => sum + c.total_seats, 0),
    remainingSeats: courses.reduce((sum, c) => sum + c.remaining_seats, 0),
    filledSeats: courses.reduce((sum, c) => sum + (c.total_seats - c.remaining_seats), 0),
  }

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(course) { setEditing(course); setModalOpen(true) }

  async function handleSubmit(data) {
    try {
      if (editing) {
        await updateCourse(editing.id, data)
        showToast('Course Updated')
      } else {
        await createCourse(data)
        showToast('Course Added')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      alert(err?.response?.data?.detail || 'Something went wrong')
    }
  }

  async function handleDelete() {
    try {
      await deleteCourse(deleteTarget.id)
      showToast('Course Deleted')
      setDeleteTarget(null)
      load()
    } catch {
      alert('Could not delete course')
    }
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-lg font-display font-bold text-slate-900">Courses</h2>
          <p className="text-xs text-slate-400 font-medium">Manage available courses and seat distribution.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors shadow-soft whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total Courses" value={totals.totalCourses} />
        <StatCard icon={Armchair} label="Total Seats" value={totals.totalSeats} />
        <StatCard icon={DoorOpen} label="Remaining Seats" value={totals.remainingSeats} />
        <StatCard icon={CheckCircle2} label="Filled Seats" value={totals.filledSeats} />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search courses by name…" />

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-4 py-3 rounded-xl">
          {errorMsg}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
      >
        {loading ? (
          <TableSkeleton rows={6} cols={9} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No courses available."
            message={search ? 'Try a different search term.' : 'Add your first course to get started.'}
            actionLabel={!search ? 'Add Course' : undefined}
            onAction={openAdd}
          />
        ) : (
          <CourseTable courses={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />
        )}
      </motion.div>

      <CourseModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this course?"
        message={`This will permanently remove ${deleteTarget?.name} and its reservation and allocation data.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

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