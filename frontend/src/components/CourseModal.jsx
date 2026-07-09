import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const empty = { name: '', total_seats: '', general_seats: '', obc_seats: '', sc_seats: '', st_seats: '' }

export default function CourseModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(initialData ? {
      name: initialData.name,
      total_seats: initialData.total_seats,
      general_seats: initialData.general_seats,
      obc_seats: initialData.obc_seats,
      sc_seats: initialData.sc_seats,
      st_seats: initialData.st_seats,
    } : empty)
    setErrors({})
  }, [initialData, open])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Course name is required'

    const fields = ['total_seats', 'general_seats', 'obc_seats', 'sc_seats', 'st_seats']
    fields.forEach((f) => {
      if (form[f] === '' || Number(form[f]) < 0) e[f] = 'Must be 0 or greater'
    })

    if (Object.keys(e).length === 0) {
      const sum =
        Number(form.general_seats) + Number(form.obc_seats) + Number(form.sc_seats) + Number(form.st_seats)
      if (sum !== Number(form.total_seats)) {
        e.total_seats = `General + OBC + SC + ST must equal Total Seats (currently ${sum})`
      }
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({
      name: form.name,
      total_seats: Number(form.total_seats),
      general_seats: Number(form.general_seats),
      obc_seats: Number(form.obc_seats),
      sc_seats: Number(form.sc_seats),
      st_seats: Number(form.st_seats),
    })
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
                {initialData ? 'Edit Course' : 'Add Course'}
              </h3>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">Course Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                  placeholder="e.g. Computer Science"
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Total Seats</label>
                <input
                  type="number"
                  value={form.total_seats}
                  onChange={(e) => setForm({ ...form, total_seats: e.target.value })}
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                  placeholder="e.g. 60"
                />
                {errors.total_seats && <p className="text-xs text-rose-600 mt-1">{errors.total_seats}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">General Seats</label>
                  <input
                    type="number"
                    value={form.general_seats}
                    onChange={(e) => setForm({ ...form, general_seats: e.target.value })}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                  {errors.general_seats && <p className="text-xs text-rose-600 mt-1">{errors.general_seats}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">OBC Seats</label>
                  <input
                    type="number"
                    value={form.obc_seats}
                    onChange={(e) => setForm({ ...form, obc_seats: e.target.value })}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                  {errors.obc_seats && <p className="text-xs text-rose-600 mt-1">{errors.obc_seats}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">SC Seats</label>
                  <input
                    type="number"
                    value={form.sc_seats}
                    onChange={(e) => setForm({ ...form, sc_seats: e.target.value })}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                  {errors.sc_seats && <p className="text-xs text-rose-600 mt-1">{errors.sc_seats}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">ST Seats</label>
                  <input
                    type="number"
                    value={form.st_seats}
                    onChange={(e) => setForm({ ...form, st_seats: e.target.value })}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                  {errors.st_seats && <p className="text-xs text-rose-600 mt-1">{errors.st_seats}</p>}
                </div>
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
                  {initialData ? 'Save Changes' : 'Add Course'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}