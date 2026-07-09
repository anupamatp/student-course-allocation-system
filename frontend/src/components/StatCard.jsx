import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    const to = Number(target) || 0
    function step(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(to * progress))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

export default function StatCard({ label, value, suffix = '', icon: Icon, tone = 'brand', delay = 0 }) {
  const animated = useCountUp(value)

  const tones = {
    brand: 'from-brand-500 to-brand-700',
    accent: 'from-accent-500 to-accent-700',
    green: 'from-emerald-500 to-emerald-700',
    red: 'from-rose-500 to-rose-700',
    amber: 'from-amber-500 to-amber-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100 hover:shadow-card transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tones[tone]} flex items-center justify-center shadow-soft`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2.25} />
        </div>
      </div>
      <p className="text-2xl font-display font-bold text-slate-900 tabular-nums">
        {animated}{suffix}
      </p>
      <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
    </motion.div>
  )
}