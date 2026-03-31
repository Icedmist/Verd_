import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, Scan, BarChart3, User, Menu, X, Zap, Leaf, Activity } from 'lucide-react'
import { cn } from '../lib/utils'

interface NavbarProps {
  currentView: 'home' | 'scan' | 'insights' | 'dashboard'
  setView: (view: 'home' | 'scan' | 'insights' | 'dashboard') => void
  theme: 'bitget' | 'greenfamily'
  setTheme: (theme: 'bitget' | 'greenfamily') => void
}

export function Navbar({ currentView, setView, theme, setTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks: { name: string, icon: React.ReactNode, id: 'home' | 'scan' | 'insights' | 'dashboard' }[] = [
    { name: 'Home', icon: <Sprout size={18} />, id: 'home' },
    { name: 'Scan', icon: <Scan size={18} />, id: 'scan' },
    { name: 'Insights', icon: <BarChart3 size={18} />, id: 'insights' },
    { name: 'Dashboard', icon: <Activity size={18} />, id: 'dashboard' },
  ]

  const toggleTheme = () => {
    const newTheme = theme === 'bitget' ? 'greenfamily' : 'bitget'
    setTheme(newTheme)
    
    const root = window.document.documentElement
    root.classList.remove('dark', 'theme-green')
    if (newTheme === 'bitget') {
      root.classList.add('dark')
    } else {
      root.classList.add('theme-green')
    }
  }

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b",
        scrolled 
          ? "py-4 bg-black/40 backdrop-blur-xl border-white/10" 
          : "py-8 bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => setView('home')}
        >
          <div className="p-1.5 rounded-xl bg-primary/20 group-hover:scale-110 transition-transform">
            <img src="/logo.png" alt="VERD" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-tighter italic text-white uppercase">VERD</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => setView(link.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  currentView === link.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-white/40 hover:text-white"
                )}
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all hover:border-primary/50 group/theme"
              title="Switch Theme"
            >
              {theme === 'bitget' ? <Zap size={18} className="group-hover/theme:text-primary transition-colors" /> : <Leaf size={18} className="group-hover/theme:text-emerald-500 transition-colors" />}
            </button>
            
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 transition-all">
              <User size={16} className="text-primary" />
              Profile
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white/60 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 p-6 bg-black/90 backdrop-blur-3xl border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button 
                  key={link.id} 
                  onClick={() => {
                    setView(link.id)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-4 text-lg font-medium transition-colors",
                    currentView === link.id ? "text-primary" : "text-white/60"
                  )}
                >
                  {link.icon}
                  {link.name}
                </button>
              ))}
              <hr className="border-white/5" />
              <div className="flex items-center justify-between">
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-3 text-white/60"
                >
                  {theme === 'bitget' ? <Zap size={20} /> : <Leaf size={20} />}
                  Change Theme
                </button>
                <button className="flex items-center gap-3 py-3 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg">
                  <User size={20} />
                  Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
