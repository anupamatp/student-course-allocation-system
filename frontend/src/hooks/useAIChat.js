import { useContext } from 'react'
import { AIContext } from '../components/ai/AIContext.jsx'

export function useAIChat() {
  const ctx = useContext(AIContext)
  if (!ctx) throw new Error('useAIChat must be used within an AIProvider')
  return ctx
}