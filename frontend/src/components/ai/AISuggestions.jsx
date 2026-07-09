import { motion } from 'framer-motion'

const suggestions = [
  'How many students were allocated to each course?',
  'Which students did not receive their first preference?',
  'Which course had the highest rejection rate?',
  'Show category-wise allocation summary.',
]

export default function AISuggestions({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((q) => (
        <motion.button
          key={q}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(q)}
          className="text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-100 px-3 py-2 rounded-full transition-colors text-left"
        >
          {q}
        </motion.button>
      ))}
    </div>
  )
}