export function exportAllocationsToCsv(allocations, filename = 'allocation-results.csv') {
  const headers = ['Student', 'Category', 'Marks', 'Allocated Course', 'Preference', 'Status']
  const rows = allocations.map((a) => [
    a.student_name,
    a.category || '',
    a.marks ?? '',
    a.course_name || 'Not Allocated',
    a.allocated_preference || '',
    a.status,
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}