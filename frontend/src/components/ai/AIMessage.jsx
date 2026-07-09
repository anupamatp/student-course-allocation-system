import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export default function AIMessage({ message }) {
  const isUser = message.role === 'user'
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-end gap-1"
      >
        <div className="max-w-[80%] bg-brand-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm">
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 pr-1">{time}</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex flex-col items-start gap-1 max-w-[80%]">
        <div className={`text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm whitespace-pre-line ${
          message.isError ? 'bg-rose-50 text-rose-700' : 'bg-surface-100 text-slate-700'
        }`}>
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 pl-1">{time}</span>
      </div>
    </motion.div>
  )
}