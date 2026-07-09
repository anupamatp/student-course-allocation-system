import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import SearchBar from '../components/SearchBar.jsx'
import StudentTable from '../components/StudentTable.jsx'
import StudentModal from '../components/StudentModal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { TableSkeleton } from '../components/LoadingSpinner.jsx'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api.js'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function load(searchTerm = '') {
    setLoading(true)
    try {
      // limit=100 so all seeded students show — adjust if you expect more
      const res = await getStudents({ search: searchTerm || undefined, skip: 0, limit: 100 })
      setStudents(res.data)
      setErrorMsg('')
    } catch {
      setErrorMsg('Could not load students. Is the backend running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // debounce search calls to the backend
  useEffect(() => {
    const timer = setTimeout(() => load(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(student) { setEditing(student); setModalOpen(true) }

  async function handleSubmit(data) {
    try {
      if (editing) {
        await updateStudent(editing.id, data)
      } else {
        await createStudent(data)
      }
      setModalOpen(false)
      load(search)
    } catch (err) {
      alert(err?.response?.data?.detail || 'Something went wrong')
    }
  }

  async function handleDelete() {
    try {
      await deleteStudent(deleteTarget.id)
      setDeleteTarget(null)
      load(search)
    } catch {
      alert('Could not delete student')
    }
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name…" />
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors shadow-soft whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </motion.div>

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
          <TableSkeleton rows={6} cols={6} />
        ) : students.length === 0 ? (
          <EmptyState
            title="No students found"
            message={search ? 'Try a different search term.' : 'Add your first student to get started.'}
            actionLabel={!search ? 'Add Student' : undefined}
            onAction={openAdd}
          />
        ) : (
          <StudentTable students={students} onEdit={openEdit} onDelete={setDeleteTarget} />
        )}
      </motion.div>

      <StudentModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this student?"
        message={`This will permanently remove ${deleteTarget?.name} and their preferences/allocation.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}