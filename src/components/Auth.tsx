import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ArrowRight, Globe, ShieldCheck } from 'lucide-react'
import { GlassCard } from './ui/GlassCard'
import { cn } from '../lib/utils'

type AuthMode = 'login' | 'signup'

export function Auth({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>('login')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md"
      >
        <GlassCard className="relative p-10 border-white/10 shadow-2xl overflow-visible">
          <button 
            onClick={onClose}
            className="absolute -top-4 -right-4 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white backdrop-blur-xl"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold tracking-tighter italic mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join VERD'}
            </h2>
            <p className="text-white/40 text-sm">
              {mode === 'login' 
                ? 'Access your neural diagnostics and field registry.' 
                : 'Start your journey into AI-driven high-fidelity agronomy.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] uppercase tracking-widest font-bold text-primary/80 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Dr. Savannah" 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary/80 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="name@savannah.tech" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/80">Security Key</label>
                {mode === 'login' && (
                  <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-white/20 hover:text-primary/60 transition-colors">Recover</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <button className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-[0_15px_40px_rgba(108,58,250,0.3)] flex items-center justify-center gap-2 group mt-8">
              {mode === 'login' ? 'INITIALIZE SESSION' : 'AUTHORIZE ACCOUNT'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-transparent px-4 text-white/20">Third-Party Auth</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-sm font-medium">
              <Globe size={18} />
              GitHub
            </button>
            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-sm font-medium">
              <ShieldCheck size={18} />
              Google
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-white/20">
              {mode === 'login' ? "Don't have a protocol set up?" : "Already possess authorization?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {mode === 'login' ? 'Create Account' : 'Initialize Session'}
              </button>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
