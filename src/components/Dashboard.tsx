import { useState } from 'react'
import { DiagnosticScanner } from './DiagnosticScanner'
import { GroundTruthInsights } from './GroundTruthInsights'
import { UserDashboard } from './UserDashboard'
import { ProfileSettings } from './ProfileSettings'
import { ScanHistory } from './ScanHistory'
import { LearningCenter } from './LearningCenter'
import { Onboarding } from './Onboarding'
import { Auth } from './Auth'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, ArrowRight, Plane as Drone, Globe, Code2, ShieldCheck, Zap } from 'lucide-react'
import { GlassCard } from './ui/GlassCard'

interface DashboardProps {
  theme: 'bitget' | 'greenfamily'
  currentView: 'home' | 'scan' | 'insights' | 'dashboard' | 'profile' | 'history' | 'learning'
}

export function Dashboard({ theme, currentView }: DashboardProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    setShowAuth(true)
  }

  return (
    <main className="container mx-auto px-6 py-12 lg:py-24 relative">
      <Onboarding isOpen={showOnboarding} onClose={handleOnboardingComplete} />
      <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} />

      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-32 items-end">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-3"
              >
                <div 
                  className="flex items-center gap-3 mb-8 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 w-fit backdrop-blur-md cursor-pointer hover:bg-primary/20 transition-colors" 
                  onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/80">SEE HOW IT WORKS</span>
                  <ArrowRight size={14} className="text-primary/60 ml-2" />
                </div>
                
                <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter mb-10 leading-[0.8] italic">
                  <span className="text-white">GROWING</span>
                  <br />
                  <span className="text-white/20 not-italic font-black">SMARTER</span> 
                  <span className="text-white/60"> TOGETHER</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/40 max-w-2xl leading-relaxed font-light">
                  Think of VERD as your digital field-hand. We're here to help you spot crop issues early, so you can focus on what you do best: farming.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <GlassCard className="h-full border-white/5 bg-black/40">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <ShieldCheck size={24} />
                    <span className="font-bold uppercase tracking-widest text-xs">Your Soil, Your Data</span>
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm mb-6">
                    We believe in agrarian sovereignty. That means your data serves your harvest, first and foremost. We provide the ground-truth insights to help you grow with confidence and security.
                  </p>
                  <div className="flex gap-4">
                    <div className="h-0.5 flex-1 bg-primary/20 rounded-full overflow-hidden">
                      <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-primary w-1/3" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Technology Hub & Usability */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <GlassCard className="group hover:border-primary/30 transition-all p-8 flex flex-col h-full bg-black/40 border-white/5">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-6 group-hover:scale-110 transition-transform">
                    <Drone size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 italic">Drone Agri-Tech</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">
                    Autonomous field monitoring with high-precision drone integration. Track crop health across hectares in minutes using VERD's aerial-optimized neural engines.
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
                  <h3 className="text-xl font-bold mb-3 italic">Open Source Model</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">
                    VERD belongs to the community. Participate in the future of decentralized agricultural AI by contributing to our pathology library and model training.
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
                    REQUEST API ACCESS <ArrowRight size={12} className="ml-2" />
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Expanded Onboarding Flow */}
            <div id="onboarding" className="mb-32">
              <div className="mb-12">
                <h2 className="text-4xl font-bold italic tracking-tighter uppercase mb-2">Getting started with <span className="text-primary not-italic">VERD</span></h2>
                <p className="text-white/40 text-sm max-w-xl">It only takes a few steps to start making your harvest smarter. Let's walk through them together.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Set Up Your Vault', desc: 'Securely create your digital identity so your scan history stays private and yours.' },
                  { step: '02', title: 'Find Your Way', desc: 'Toggle between Scans, Insights, and the Tech Hub using the simple sidebar on the left.' },
                  { step: '03', title: 'Capture a Leaf', desc: 'Snap a clear photo of any crop issue. Our AI works in the background to spot pathology markers.' },
                  { step: '04', title: 'Get Expert Advice', desc: 'Review the results and follow the suggested steps to optimize your yield and protect your field.' }
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
              <DiagnosticScanner />
            </div>
          </motion.div>
        )}

        {currentView === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="pt-20"
          >
            <DiagnosticScanner />
          </motion.div>
        )}

        {currentView === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="pt-20"
          >
             <GroundTruthInsights />
          </motion.div>
        )}
        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="pt-20"
          >
             <UserDashboard />
          </motion.div>
        )}
        {currentView === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="pt-20"
          >
             <ProfileSettings />
          </motion.div>
        )}

        {currentView === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="pt-20"
          >
             <ScanHistory />
          </motion.div>
        )}

        {currentView === 'learning' && (
          <motion.div
            key="learning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="pt-20"
          >
             <LearningCenter />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-48 pt-12 border-t border-white/5 text-white/20 text-[10px] uppercase tracking-[0.4em] flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© 2026 VERD Technologies • Agrarian Tech Stack • v1.0.4</p>
        <div className="flex gap-12 font-bold">
          <a href="#" className="hover:text-primary transition-colors">Smart API</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Shield</a>
          <a href="#" className="hover:text-primary transition-colors">Farm Protocol</a>
        </div>
      </footer>
    </main>
  )
}
