import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const empty = { name: '', marks: '', category: 'GENERAL', application_date: '' }

export default function StudentModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(initialData ? {
      name: initialData.name,
      marks: initialData.marks,
      category: initialData.category,
      application_date: initialData.application_date,
    } : empty)
    setErrors({})
  }, [initialData, open])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (form.marks === '' || Number(form.marks) < 0) e.marks = 'Enter a valid, non-negative mark'
    if (!form.application_date) e.application_date = 'Application date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, marks: Number(form.marks) })
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-xl2 shadow-card p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-slate-900">
                {initialData ? 'Edit Student' : 'Add Student'}
              </h3>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                  placeholder="e.g. Alice Sharma"
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Marks</label>
                <input
                  type="number" step="0.01"
                  value={form.marks}
                  onChange={(e) => setForm({ ...form, marks: e.target.value })}
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                  placeholder="e.g. 92.50"
                />
                {errors.marks && <p className="text-xs text-rose-600 mt-1">{errors.marks}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none bg-white"
                >
                  <option value="GENERAL">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Application Date</label>
                <input
                  type="date"
                  value={form.application_date}
                  onChange={(e) => setForm({ ...form, application_date: e.target.value })}
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                />
                {errors.application_date && <p className="text-xs text-rose-600 mt-1">{errors.application_date}</p>}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button" onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-surface-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-soft"
                >
                  {initialData ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}