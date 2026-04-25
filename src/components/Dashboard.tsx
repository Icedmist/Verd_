import { useState } from 'react'
import { Onboarding } from './Onboarding'
import { Auth } from './Auth'
import { motion } from 'framer-motion'
import { Info, ArrowRight, Plane as Drone, Globe, Code2, ShieldCheck, Zap, Leaf, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlassCard } from './ui/GlassCard'
import { cn } from '../lib/utils'
import { DiagnosticScanner } from './DiagnosticScanner'
import DailyTip from './DailyTip'
import { LiveDroneDemo } from './LiveDroneDemo'

interface DashboardProps {
  theme: 'bitget' | 'greenfamily'
  setTheme: (theme: 'bitget' | 'greenfamily') => void
  showAuth: boolean
  setShowAuth: (show: boolean) => void
  authMode: 'login' | 'signup'
  setAuthMode: (mode: 'login' | 'signup') => void
}

export function Dashboard({ 
  theme, 
  setTheme, 
  showAuth,
  setShowAuth,
  authMode,
  setAuthMode
}: DashboardProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    setAuthMode('signup')
    setShowAuth(true)
  }

  return (
    <main className="container mx-auto px-6 py-12 lg:py-24 relative">
      <Onboarding isOpen={showOnboarding} onClose={handleOnboardingComplete} />
      <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />

      <motion.div
        key="home"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32 items-center pt-24 md:pt-40">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8"
          >
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div 
                className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-5 py-2.5 backdrop-blur-md cursor-pointer hover:bg-primary/20 transition-all group/see" 
                onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary">SEE HOW IT WORKS</span>
                <ArrowRight size={14} className="text-primary/60 group-hover/see:translate-x-1 transition-transform" />
              </div>

              <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

              {/* Hero Theme Switcher - ICON ONLY */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1.5 group/toggle backdrop-blur-xl">
                <button 
                  onClick={() => setTheme('bitget')}
                  title="Switch to Bitget Theme"
                  className={cn(
                    "p-2 rounded-full transition-all",
                    theme === 'bitget' ? "bg-primary text-black shadow-[0_0_15px_rgba(0,214,177,0.3)]" : "text-white/40 hover:text-white"
                  )}
                >
                  <Zap size={16} />
                </button>
                <button 
                  onClick={() => setTheme('greenfamily')}
                  title="Switch to Neural Theme"
                  className={cn(
                    "p-2 rounded-full transition-all",
                    theme === 'greenfamily' ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "text-white/40 hover:text-white"
                  )}
                >
                  <Leaf size={16} />
                </button>
              </div>
            </div>
            
            <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-bold tracking-tighter mb-10 leading-[0.8] italic group">
              <span className="text-white inline-block hover:translate-x-2 transition-transform duration-500">GROWING</span>
              <br />
              <span className="text-white/20 not-italic font-black inline-block hover:-translate-x-2 transition-transform duration-500">SMARTER</span> 
              <span className="text-white/60"> TOGETHER</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-white/40 max-w-2xl leading-relaxed font-light mb-12">
              Think of <span className="text-white font-medium">VERD</span> as your digital field-hand. We're here to help you spot crop issues early, so you can focus on what you do best: <span className="text-primary italic">farming.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/scan" className="px-10 py-5 bg-primary text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-105 transition-all shadow-[0_15px_40px_rgba(0,214,177,0.2)] flex items-center justify-center">
                Start Scanning Now
              </Link>
              <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/10 transition-all">
                Platform Docs
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4"
          >
            <GlassCard className="p-8 border-white/5 bg-black/40 relative overflow-hidden group/card shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-6 text-primary">
                <ShieldCheck size={28} />
                <span className="font-bold uppercase tracking-[0.3em] text-[10px]">Your Soil, Your Data</span>
              </div>
              <p className="text-white/60 leading-relaxed text-sm mb-8 relative z-10 font-light">
                We believe in <span className="text-white font-medium">agrarian sovereignty</span>. That means your data serves your harvest, first and foremost. We provide the ground-truth insights to help you grow with confidence and security.
              </p>
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">System Stability</span>
                  <span className="text-xs font-bold text-primary italic">99.8%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.8%' }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(0,214,177,0.5)]" 
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Platform Selection Banner */}
        <div className="mb-32">
          <GlassCard className="rounded-[2.5rem] p-8 border-white/5 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-white/5 opacity-20 group-hover:opacity-40 transition-opacity">
              <Smartphone size={160} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-3xl bg-primary/20 text-primary shadow-[0_0_30px_rgba(0,214,177,0.2)]">
                  <Smartphone size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold italic tracking-tighter mb-2">VERD IS BETTER ON MOBILE</h2>
                  <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                    Experience real-time field diagnostics with our dedicated Android application. Optimized for low-latency AI inference and offline field tracking.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <a 
                  href="https://github.com/Jibex-Banks/_verd/releases/download/Verd_Andriod/Verd.apk" 
                  className="px-10 py-5 bg-primary text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-105 transition-all shadow-[0_15px_40px_rgba(0,214,177,0.3)] flex items-center justify-center gap-3"
                >
                  Download APK
                  <ArrowRight size={14} />
                </a>
                <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/10 transition-all">
                  Continue on Web
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="max-w-xl mx-auto mb-32">
          <DailyTip />
        </div>

        {/* Technology Hub & Usability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="group hover:border-primary/30 transition-all p-8 flex flex-col h-full bg-black/40 border-white/5">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-6 group-hover:scale-110 transition-transform">
                <Drone size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 italic">VERD Aerial</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Autonomous field monitoring with high-precision drone integration. Track crop health across hectares in minutes using the VERD aerial suite.
              </p>
              <ul className="text-[10px] text-white/20 space-y-2 mb-6 font-bold uppercase tracking-widest">
                <li className="flex items-center gap-2 text-primary/60"><Zap size={10} /> RTK GPS Support</li>
                <li className="flex items-center gap-2"><Zap size={10} /> Multi-Spectral Imaging</li>
                <li className="flex items-center gap-2"><Zap size={10} /> Payload Integration</li>
              </ul>
              <div className="mt-auto pt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary cursor-pointer transition-colors">
                EXPLORE AERIAL SUITE <ArrowRight size={12} className="ml-2" />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="group hover:border-primary/30 transition-all p-8 flex flex-col h-full bg-black/40 border-white/5">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 italic">VERD Hub</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                The VERD network belongs to the community. Participate in the future of decentralized agricultural AI by contributing to our pathology library.
              </p>
              <ul className="text-[10px] text-white/20 space-y-2 mb-6 font-bold uppercase tracking-widest">
                <li className="flex items-center gap-2 text-primary/60"><Zap size={10} /> MIT Licensed</li>
                <li className="flex items-center gap-2"><Zap size={10} /> 40k+ Training Datasets</li>
                <li className="flex items-center gap-2"><Zap size={10} /> Community Support</li>
              </ul>
              <a href="https://github.com/icedmist/verd" className="mt-auto pt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-primary">
                CONTRIBUTE ON GITHUB <ArrowRight size={12} className="ml-2" />
              </a>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard className="group hover:border-primary/30 transition-all p-8 flex flex-col h-full bg-black/40 border-white/5">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-6 group-hover:scale-110 transition-transform">
                <Code2 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 italic">Dev-First Design</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Built by designers, for developers. Our headless API allows for infinite customization and integration into existing ERP frameworks and mobile tools.
              </p>
              <ul className="text-[10px] text-white/20 space-y-2 mb-6 font-bold uppercase tracking-widest">
                <li className="flex items-center gap-2 text-primary/60"><Zap size={10} /> REST & gRPC API</li>
                <li className="flex items-center gap-2"><Zap size={10} /> Webhook Notifications</li>
                <li className="flex items-center gap-2"><Zap size={10} /> SDKs (Go, TS, Python)</li>
              </ul>
              <div className="mt-auto pt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white cursor-pointer transition-colors">
                REQUEST VERD API <ArrowRight size={12} className="ml-2" />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Live Drone Demo Section */}
        <div className="mb-32">
          <div className="mb-12">
            <h2 className="text-4xl font-bold italic tracking-tighter uppercase mb-2">Live <span className="text-primary not-italic font-black">Drone</span> Field Analysis</h2>
            <p className="text-white/40 text-sm max-w-xl">Experience the power of our real-time aerial diagnostic engine. Upload a drone capture to see the neural grid in action.</p>
          </div>
          <LiveDroneDemo />
        </div>

        {/* Expanded Onboarding Flow */}
        <div id="onboarding" className="mb-32">
          <div className="mb-12">
            <h2 className="text-4xl font-bold italic tracking-tighter uppercase mb-2">Getting started with <span className="text-primary not-italic font-black">VERD</span></h2>
            <p className="text-white/40 text-sm max-w-xl">It only takes a few steps to start making your harvest smarter. Let's walk through them together.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Create Account', desc: 'Securely create your profile so your scan history stays private and accessible everywhere.' },
              { step: '02', title: 'Explore Dashboard', desc: 'Get familiar with your custom field insights and recent pathological trends.' },
              { step: '03', title: 'Connect Sensors', desc: 'Link your field hardware or drone suite for real-time biometric data streaming.' },
              { step: '04', title: 'Capture Sample', desc: 'Snap a clear photo of any crop issue. Our AI spots pathology markers instantly.' },
              { step: '05', title: 'Review Diagnosis', desc: 'Follow suggested steps from our neural models to protect your field.' },
              { step: '06', title: 'Share & Grow', desc: 'Contribute to the open pathology database and learn from the global community.' }
            ].map((item, i) => (
              <GlassCard key={i} className="p-8 border-white/5 bg-black/20 hover:bg-black/40 transition-all group">
                <span className="text-6xl font-black text-white/[0.02] group-hover:text-primary/[0.05] transition-colors leading-none block mb-4 italic">{item.step}</span>
                <h4 className="font-bold mb-3 text-sm text-primary uppercase tracking-widest">{item.title}</h4>
                <p className="text-white/40 text-xs leading-relaxed font-light">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
        
        <div className="space-y-32">
          <DiagnosticScanner theme={theme} />
        </div>

        {/* Final Conversion Section */}
        <div className="mt-32 mb-24 text-center">
          <GlassCard className="max-w-4xl mx-auto p-16 border-primary/20 bg-primary/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-5xl font-bold italic tracking-tighter mb-6 relative z-10">START YOUR <span className="text-primary not-italic font-black">JOURNEY</span></h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto mb-10 relative z-10">
              Join the community today and protect your harvest with the latest in decentralized AI.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
              <button 
                onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                className="px-12 py-5 bg-primary text-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 transition-transform active:scale-95 shadow-[0_10px_40px_rgba(0,214,177,0.3)]"
              >
                Create My Identity
              </button>
              <button 
                onClick={() => { setAuthMode('login'); setShowAuth(true); }}
                className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white/10 transition-all"
              >
                Sign In
              </button>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      <footer className="mt-48 pt-12 border-t border-white/5 text-white/20 text-[10px] uppercase tracking-[0.4em] flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© 2026 VERD • Engineered by White Walkers • v1.0.4</p>
        <div className="flex gap-12 font-bold">
          <a href="#" className="hover:text-primary transition-colors">Smart API</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Shield</a>
          <a href="#" className="hover:text-primary transition-colors">Farm Protocol</a>
        </div>
      </footer>
    </main>
  )
}
