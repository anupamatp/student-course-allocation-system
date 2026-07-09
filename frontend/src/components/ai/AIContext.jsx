import { createContext, useState, useCallback } from 'react'
import { sendAIMessage } from '../../services/aiService.js'

export const AIContext = createContext(null)

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "👋 Hello! I'm your Student Course Allocation Assistant.\n\nI can answer questions about:\n• Course Allocation\n• Student Preferences\n• Category Summary\n• Rejection Statistics\n• Seat Availability",
  timestamp: new Date(),
  isWelcome: true,
}

export function AIProvider({ children }) {
  const [messages, setMessages] = useState([welcomeMessage])
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return

    const userMessage = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const res = await sendAIMessage(text)
      const aiMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch {
      const errorMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Unable to contact AI Assistant. Please try again.',
        timestamp: new Date(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearChat = useCallback(() => setMessages([welcomeMessage]), [])
  const toggleOpen = useCallback(() => setIsOpen((v) => !v), [])
  const closeChat = useCallback(() => { setIsOpen(false); setIsMinimized(false) }, [])
  const toggleMinimize = useCallback(() => setIsMinimized((v) => !v), [])

  return (
    <AIContext.Provider value={{
      messages, isOpen, isMinimized, loading,
      sendMessage, clearChat, toggleOpen, closeChat, toggleMinimize,
    }}>
      {children}
    </AIContext.Provider>
  )
}