import { useState } from 'react'
import { Bot, Minus, X, MoreVertical, Trash2, Copy, Maximize2 } from 'lucide-react'

export default function AIHeader({ onMinimize, onClose, onClear, onCopyLast, isMinimized }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative flex items-center justify-between px-5 py-4 rounded-t-xl2 bg-gradient-to-r from-brand-600 to-accent-600 text-white shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-display font-bold leading-tight">AI Assistant</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-[11px] text-white/80 font-medium">Online</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4 pointer-events-none" />
        </button>
        <button
          onClick={onMinimize}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors"
          aria-label={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? <Maximize2 className="w-4 h-4 pointer-events-none" /> : <Minus className="w-4 h-4 pointer-events-none" />}
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 pointer-events-none" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-14 right-4 bg-white rounded-xl shadow-card border border-slate-100 py-1.5 w-44 z-10">
          <button
            onClick={() => { onClear(); setMenuOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-surface-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Chat
          </button>
          <button
            onClick={() => { onCopyLast(); setMenuOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-surface-100 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Last Response
          </button>
          <button
            onClick={() => { onMinimize(); setMenuOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-surface-100 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" /> Collapse Chat
          </button>
        </div>
      )}
    </div>
  )
}