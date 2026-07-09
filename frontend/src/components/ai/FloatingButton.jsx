import { motion, AnimatePresence } from 'framer-motion'
import { Bot } from 'lucide-react'
import { useState } from 'react'

export default function FloatingButton({ onClick, isOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[80]">
      <AnimatePresence>
        {hovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 8, y: 4 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-card"
          >
            AI Assistant
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-30" />
      )}

      <motion.button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 shadow-card flex items-center justify-center text-white"
        aria-label="AI Assistant"
      >
        <Bot className="w-6 h-6 pointer-events-none" />
      </motion.button>
    </div>
  )
}