import { useState } from 'react'
import { Send } from 'lucide-react'

export default function AIInput({ onSend, loading }) {
  const [value, setValue] = useState('')

  function handleSend() {
    if (!value.trim() || loading) return
    onSend(value)
    setValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3.5 border-t border-slate-100 shrink-0">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="Ask a question..."
        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-surface-50 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all disabled:opacity-60"
      />
      <button
        onClick={handleSend}
        disabled={loading || !value.trim()}
        className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        aria-label="Send message"
      >
        <Send className="w-4 h-4 pointer-events-none" />
      </button>
    </div>
  )
}