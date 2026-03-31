import { useState, useEffect } from 'react'
import { ThemeToggle } from './components/ThemeToggle'
import { LiquidMetalBackground } from './components/LiquidMetalBackground'
import { NeuralBackground } from './components/NeuralBackground'
import { Dashboard } from './components/Dashboard'

function App() {
  const [theme, setTheme] = useState<'bitget' | 'greenfamily'>('bitget')

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
    <div className="min-h-screen text-white font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {theme === 'bitget' ? <LiquidMetalBackground /> : <NeuralBackground />}
      
      <ThemeToggle />

      <Dashboard theme={theme} />
    </div>
  )
}

export default App
