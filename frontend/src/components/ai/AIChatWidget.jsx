import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FloatingButton from './FloatingButton.jsx'
import AIHeader from './AIHeader.jsx'
import AIMessage from './AIMessage.jsx'
import AIInput from './AIInput.jsx'
import AISuggestions from './AISuggestions.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import { useAIChat } from '../../hooks/useAIChat.js'

export default function AIChatWidget() {
  const { messages, isOpen, isMinimized, loading, sendMessage, clearChat, toggleOpen, closeChat, toggleMinimize } = useAIChat()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading, isMinimized])

  function handleCopyLast() {
    const lastAI = [...messages].reverse().find((m) => m.role === 'assistant')
    if (lastAI) navigator.clipboard.writeText(lastAI.content)
  }

  return (
    <>
      <FloatingButton onClick={toggleOpen} isOpen={isOpen} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0, height: isMinimized ? 64 : 650 }}
            exit={{ opacity: 0, x: 40, y: 20 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed bottom-24 right-6 z-[80] w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-xl2 shadow-card border border-slate-100 flex flex-col overflow-hidden
              max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:max-w-full"
          >
            <AIHeader
              onMinimize={toggleMinimize}
              onClose={closeChat}
              onClear={clearChat}
              onCopyLast={handleCopyLast}
              isMinimized={isMinimized}
            />

            {!isMinimized && (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-surface-50/40">
                  {messages.map((m) => (
                    <div key={m.id}>
                      <AIMessage message={m} />
                      {m.isWelcome && <AISuggestions onSelect={sendMessage} />}
                    </div>
                  ))}
                  {loading && <TypingIndicator />}
                </div>

                <AIInput onSend={sendMessage} loading={loading} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}