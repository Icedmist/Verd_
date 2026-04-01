import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { LiquidMetalBackground } from './components/LiquidMetalBackground'
import { NeuralBackground } from './components/NeuralBackground'
import { Dashboard } from './components/Dashboard'
import { DiagnosticScanner } from './components/DiagnosticScanner'
import { GroundTruthInsights } from './components/GroundTruthInsights'
import { UserDashboard } from './components/UserDashboard'
import { ProfileSettings } from './components/ProfileSettings'
import { ScanHistory } from './components/ScanHistory'
import LearningCenter from './components/LearningCenter'
import CourseView from './components/CourseView'
import { ScanReport } from './components/ScanReport'
import { auth } from './lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { seedCourses } from './lib/seed'

// Protected Route Wrapper
const ProtectedRoute = ({ user, loading, children, setShowAuth }: { user: User | null, loading: boolean, children: React.ReactNode, setShowAuth: (v: boolean) => void }) => {
  if (loading) return null
  if (!user) {
    setShowAuth(true)
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const [theme, setTheme] = useState<'bitget' | 'greenfamily'>('bitget')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isGreen = document.documentElement.classList.contains('theme-green')
          setTheme(isGreen ? 'greenfamily' : 'bitget')
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    
    const isGreen = document.documentElement.classList.contains('theme-green')
    setTheme(isGreen ? 'greenfamily' : 'bitget')

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (user) {
        console.log('Auth confirmed: Attempting to seed courses/tips...')
        seedCourses().catch(err => console.error('Seeding failed:', err))
      }
    })

    // console.log('Mounting App, calling seed...');
    // seedCourses();

    return () => {
      observer.disconnect()
      unsubscribe()
    }
  }, [])

  if (loading) return null

  return (
    <div className="relative min-h-screen w-full text-white font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <ScrollToTop />
      
      {/* Global Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {theme === 'bitget' ? <LiquidMetalBackground /> : <NeuralBackground />}
      </div>
      
      {/* Application Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar theme={theme} setTheme={setTheme} showAuth={showAuth} setShowAuth={setShowAuth} setAuthMode={setAuthMode} />
        
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  theme={theme} 
                  setTheme={setTheme} 
                  showAuth={showAuth} 
                  setShowAuth={setShowAuth} 
                  authMode={authMode} 
                  setAuthMode={setAuthMode} 
                />
              } 
            />
            
            <Route path="/scan" element={<ProtectedRoute user={user} loading={loading} setShowAuth={setShowAuth}><div className="pt-32 px-6"><DiagnosticScanner theme={theme} /></div></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute user={user} loading={loading} setShowAuth={setShowAuth}><div className="pt-32 px-6"><GroundTruthInsights /></div></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading} setShowAuth={setShowAuth}><div className="pt-32 px-6"><UserDashboard /></div></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user} loading={loading} setShowAuth={setShowAuth}><div className="pt-32 px-6"><ProfileSettings /></div></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute user={user} loading={loading} setShowAuth={setShowAuth}><div className="pt-32 px-6"><ScanHistory /></div></ProtectedRoute>} />
            <Route path="/learning" element={<ProtectedRoute user={user} loading={loading} setShowAuth={setShowAuth}><div className="pt-32 px-6"><LearningCenter /></div></ProtectedRoute>} />
            <Route path="/learning/:courseId" element={<ProtectedRoute user={user} loading={loading} setShowAuth={setShowAuth}><div className="pt-32 px-6"><CourseView /></div></ProtectedRoute>} />
            <Route path="/report/:id" element={<ProtectedRoute user={user} loading={loading} setShowAuth={setShowAuth}><div className="pt-32 px-6"><ScanReport /></div></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
