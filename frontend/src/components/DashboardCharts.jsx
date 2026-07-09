import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const CATEGORY_COLORS = { GENERAL: '#94a3b8', OBC: '#f59e0b', SC: '#3b82f6', ST: '#8b5cf6' }
const STATUS_COLORS = { ALLOCATED: '#10b981', NOT_ALLOCATED: '#f43f5e' }

function ChartCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl2 p-5 shadow-soft border border-slate-100"
    >
      <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}

export function CategoryPieChart({ students }) {
  const counts = { GENERAL: 0, OBC: 0, SC: 0, ST: 0 }
  students.forEach((s) => { if (counts[s.category] !== undefined) counts[s.category]++ })
  const data = Object.entries(counts).map(([category, value]) => ({ name: category, value }))

  return (
    <ChartCard title="Students by Category">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={0} outerRadius={80} paddingAngle={2}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function SeatUtilizationChart({ courses, allocations }) {
  const data = courses.map((c) => {
    const allocated = allocations.filter(
      (a) => a.status === 'ALLOCATED' && a.course_name === c.name
    ).length
    const remaining =
      (c.remaining_general_seats ?? 0) +
      (c.remaining_obc_seats ?? 0) +
      (c.remaining_sc_seats ?? 0) +
      (c.remaining_st_seats ?? 0)
    return { name: c.name, Allocated: allocated, Remaining: remaining }
  })

  return (
    <ChartCard title="Course Seat Utilization">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Allocated" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Remaining" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function AllocationDonutChart({ allocations }) {
  const allocated = allocations.filter((a) => a.status === 'ALLOCATED').length
  const notAllocated = allocations.filter((a) => a.status === 'NOT_ALLOCATED').length
  const data = [
    { name: 'Allocated', value: allocated },
    { name: 'Not Allocated', value: notAllocated },
  ]

  return (
    <ChartCard title="Allocation Status">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
            <Cell fill={STATUS_COLORS.ALLOCATED} />
            <Cell fill={STATUS_COLORS.NOT_ALLOCATED} />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}