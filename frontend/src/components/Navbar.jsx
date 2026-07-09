import { Menu, Bell } from 'lucide-react'

export default function Navbar({ title, onMenuClick }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-5 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-800">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-display font-bold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-400 font-medium">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative w-9 h-9 rounded-full bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors">
            <Bell className="w-[17px] h-[17px] text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-600" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white text-sm font-semibold shadow-soft">
            A
          </div>
        </div>
      </div>
    </header>
  )
}