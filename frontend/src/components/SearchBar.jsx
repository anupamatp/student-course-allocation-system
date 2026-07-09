import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative w-full sm:w-72 group">
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-brand-600" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
          placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100
          outline-none transition-all duration-200"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200
            flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-3 h-3 pointer-events-none" />
        </button>
      )}
    </div>
  )
}