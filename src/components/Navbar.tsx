import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, Scan, BarChart3, User, Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', icon: <Sprout size={18} />, href: '#' },
    { name: 'Scan', icon: <Scan size={18} />, href: '#scan' },
    { name: 'Insights', icon: <BarChart3 size={18} />, href: '#insights' },
  ]

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
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 rounded-xl bg-primary/20 text-primary group-hover:rotate-12 transition-transform">
            <Sprout size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter italic text-white">VERD</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors group"
            >
              <span className="text-white/20 group-hover:text-primary transition-colors">{link.icon}</span>
              {link.name}
            </a>
          ))}
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 transition-all">
            <User size={16} className="text-primary" />
            Profile
          </button>
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
                <a 
                  key={link.name} 
                  href={link.href}
                  className="flex items-center gap-4 text-lg font-medium text-white/60"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-primary">{link.icon}</span>
                  {link.name}
                </a>
              ))}
              <hr className="border-white/5" />
              <button className="flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20">
                <User size={20} />
                Access Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
