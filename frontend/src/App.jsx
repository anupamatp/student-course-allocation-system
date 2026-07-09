import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar.jsx'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Students from './pages/Students.jsx'
import Courses from './pages/Courses.jsx'
import Allocation from './pages/Allocation.jsx'
import { AIProvider } from './components/ai/AIContext.jsx'
import AIChatWidget from './components/ai/AIChatWidget.jsx'

const titles = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/courses': 'Courses',
  '/allocation': 'Allocation',
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = titles[location.pathname] || 'Not Found'

  return (
    <AIProvider>
      <div className="flex min-h-screen bg-surface-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-5 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/allocation" element={<Allocation />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px', fontWeight: 500 } }} />
        <AIChatWidget />
      </div>
    </AIProvider>
  )
}

export default App