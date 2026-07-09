import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPageNumbers(current, total) {
  const delta = 1
  const range = []
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }
  if (range[0] > 1) {
    range.unshift('…')
    range.unshift(1)
  }
  if (range[range.length - 1] < total) {
    range.push('…')
    range.push(total)
  }
  return range
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-1 pt-4">
      <p className="text-xs text-slate-400 font-medium">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500
            hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 pointer-events-none" />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-300 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                p === page
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'text-slate-500 hover:bg-surface-100 border border-transparent'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500
            hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 pointer-events-none" />
        </button>
      </div>
    </div>
  )
}