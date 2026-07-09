import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PlayCircle, Loader2, CheckCircle2, XCircle, Target, Download } from 'lucide-react'
import SearchBar from '../components/SearchBar.jsx'
import StatCard from '../components/StatCard.jsx'
import CircularProgress from '../components/CircularProgress.jsx'
import AllocationTable from '../components/AllocationTable.jsx'
import AllocationDrawer from '../components/AllocationDrawer.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { TableSkeleton } from '../components/LoadingSpinner.jsx'
import { getAllocations, runAllocation } from '../services/api.js'
import { exportAllocationsToCsv } from '../utils/exportCsv.js'

const statusFilters = [
  { key: 'ALL', label: 'All' },
  { key: 'ALLOCATED', label: 'Allocated' },
  { key: 'NOT_ALLOCATED', label: 'Not Allocated' },
]
const categoryFilters = ['ALL', 'GENERAL', 'OBC', 'SC', 'ST']
const preferenceFilters = ['ALL', 1, 2, 3]

export default function Allocation() {
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(true) // becomes false only if fetch returns empty AND never run
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [preferenceFilter, setPreferenceFilter] = useState('ALL')
  const [drawerRecord, setDrawerRecord] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const res = await getAllocations()
      setAllocations(res.data)
    } catch {
      toast.error('Could not load allocation results.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleRunAllocation() {
    setRunning(true)
    try {
      await runAllocation()
      toast.success('Allocation completed successfully.')
      await load()
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Allocation failed. Check the backend logs.')
    } finally {
      setRunning(false)
    }
  }

  const filtered = useMemo(() => {
    let list = allocations
    if (statusFilter !== 'ALL') list = list.filter((a) => a.status === statusFilter)
    if (categoryFilter !== 'ALL') list = list.filter((a) => a.category === categoryFilter)
    if (preferenceFilter !== 'ALL') list = list.filter((a) => a.allocated_preference === preferenceFilter)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((a) =>
        (a.student_name || '').toLowerCase().includes(q) ||
        (a.course_name || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [allocations, search, statusFilter, categoryFilter, preferenceFilter])

  const total = allocations.length
  const allocatedCount = allocations.filter((a) => a.status === 'ALLOCATED').length
  const notAllocatedCount = total - allocatedCount
  const successRate = total > 0 ? (allocatedCount / total) * 100 : 0

  function handleExport() {
    if (filtered.length === 0) {
      toast.error('Nothing to export yet.')
      return
    }
    exportAllocationsToCsv(filtered)
    toast.success('Exported allocation results as CSV.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="font-display font-bold text-slate-900 text-lg">Course Allocation</h2>
          <p className="text-xs text-slate-400 mt-0.5">Run the allocation algorithm and view allocation results.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-surface-100 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleRunAllocation}
            disabled={running}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white text-sm font-semibold hover:opacity-95 transition-opacity shadow-soft disabled:opacity-70 whitespace-nowrap"
          >
            {running ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Running Allocation…
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" /> Run Allocation
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Allocated Students" value={allocatedCount} icon={CheckCircle2} tone="green" delay={0} />
        <StatCard label="Not Allocated" value={notAllocatedCount} icon={XCircle} tone="red" delay={0.05} />
        <StatCard label="Total Processed" value={total} icon={Target} tone="brand" delay={0.1} />
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100 flex items-center gap-4"
        >
          <CircularProgress percentage={successRate} size={64} strokeWidth={7} />
          <div>
            <p className="text-xs text-slate-500 font-medium">Success Rate</p>
            <p className="text-[11px] text-slate-400 mt-0.5">of processed students</p>
          </div>
        </motion.div>
      </div>

      {/* Allocation summary strip */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-100 rounded-xl2 px-5 py-3.5 text-sm"
        >
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4" /> {allocatedCount} Students Allocated
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-medium">
            <XCircle className="w-4 h-4" /> {notAllocatedCount} Students Could Not Be Allocated
          </span>
          <span className="flex items-center gap-1.5 text-brand-700 font-medium">
            <Target className="w-4 h-4" /> Success Rate: {successRate.toFixed(1)}%
          </span>
        </motion.div>
      )}

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-3"
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student or course…" />

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === f.key ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-surface-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 outline-none focus:border-brand-400"
          >
            {categoryFilters.map((c) => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
            ))}
          </select>

          <select
            value={preferenceFilter}
            onChange={(e) => setPreferenceFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 outline-none focus:border-brand-400"
          >
            {preferenceFilters.map((p) => (
              <option key={p} value={p}>{p === 'ALL' ? 'All Preferences' : `Preference ${p}`}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
      >
        {running ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Running allocation algorithm…</p>
          </div>
        ) : loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : total === 0 ? (
          <EmptyState
            title="No allocation has been performed yet"
            message="Run the allocation engine to match students with courses based on marks, category, and preferences."
            actionLabel="Run Allocation"
            onAction={handleRunAllocation}
          />
        ) : filtered.length === 0 ? (
          <EmptyState title="No results match your filters" message="Try adjusting your search or filters." />
        ) : (
          <AllocationTable allocations={filtered} onRowClick={setDrawerRecord} />
        )}
      </motion.div>

      <AllocationDrawer open={!!drawerRecord} record={drawerRecord} onClose={() => setDrawerRecord(null)} />
    </div>
  )
}