import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { LiquidMetalBackground } from './components/LiquidMetalBackground'
import { NeuralBackground } from './components/NeuralBackground'
import { Dashboard } from './components/Dashboard'

function App() {
  const [theme, setTheme] = useState<'bitget' | 'greenfamily'>('bitget')
  const [currentView, setCurrentView] = useState<'home' | 'scan' | 'insights' | 'dashboard' | 'profile' | 'history' | 'learning'>('home')

  // Listen for theme changes from the Root element classes
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
    
    // Initial sync
    const isGreen = document.documentElement.classList.contains('theme-green')
    setTheme(isGreen ? 'greenfamily' : 'bitget')

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen w-full text-white font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Global Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {theme === 'bitget' ? <LiquidMetalBackground /> : <NeuralBackground />}
      </div>
      
      {/* Application Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentView={currentView} setView={setCurrentView} theme={theme} setTheme={setTheme} />
        <main className="flex-1">
          <Dashboard theme={theme} currentView={currentView} />
        </main>
      </div>
    </div>
  )
}

export default App
