import { useState, useEffect } from 'react'
import { Sun, Moon, Leaf, Zap } from 'lucide-react'
import { cn } from '../lib/utils'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'bitget' | 'greenfamily'>('bitget')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('dark', 'theme-green')
    
    if (theme === 'bitget') {
      root.classList.add('dark')
    } else {
      root.classList.add('theme-green')
    }
  }, [theme])

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
      <button
        onClick={() => setTheme('bitget')}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          theme === 'bitget' ? "bg-primary text-white shadow-[0_0_15px_rgba(108,58,250,0.5)]" : "text-gray-400 hover:text-white"
        )}
      >
        <Zap size={20} />
      </button>
      <button
        onClick={() => setTheme('greenfamily')}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          theme === 'greenfamily' ? "bg-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "text-gray-400 hover:text-white"
        )}
      >
        <Leaf size={20} />
      </button>
    </div>
  )
}
