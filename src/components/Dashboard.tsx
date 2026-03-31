import { useState } from 'react'
import { DiagnosticScanner } from './DiagnosticScanner'
import { GroundTruthInsights } from './GroundTruthInsights'
import { Onboarding } from './Onboarding'
import { motion } from 'framer-motion'
import { Info, ArrowRight } from 'lucide-react'
import { GlassCard } from './ui/GlassCard'

export function Dashboard({ theme }: { theme: 'bitget' | 'greenfamily' }) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  return (
    <main className="container mx-auto px-6 py-12 lg:py-24 relative">
      <Onboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-32 items-end">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-3"
        >
          <div className="flex items-center gap-3 mb-8 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 w-fit backdrop-blur-md cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => setShowOnboarding(true)}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/80">EXPLORE ONBOARDING</span>
            <ArrowRight size={14} className="text-primary/60 ml-2" />
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter mb-10 leading-[0.8] italic">
            <span className="text-white">VERD</span>
            <br />
            <span className="text-white/20 not-italic font-black">AI</span> 
            <span className="text-white/60"> AGRONOMY</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/40 max-w-2xl leading-relaxed font-light">
            Empowering the Savannah belt with high-fidelity neural diagnostics and real-time ground-truth interventions.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <GlassCard className="h-full border-white/5 bg-white/5">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <Info size={24} />
            <span className="font-bold uppercase tracking-widest text-xs">Mission Profile</span>
          </div>
          <p className="text-white/60 leading-relaxed text-sm mb-6">
            VERD is an AI-driven platform designed to identify crop pathologies with leaf-level precision. Our mission is to stabilize agricultural output through data-driven resilience and localized biometric intelligence.
          </p>
          <div className="flex gap-4">
            <div className="h-0.5 flex-1 bg-primary/20 rounded-full overflow-hidden">
              <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-primary w-1/3" />
            </div>
          </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-32">
        <DiagnosticScanner />
        <GroundTruthInsights />
      </div>

      {/* Footer Branding */}
      <footer className="mt-48 pt-12 border-t border-white/5 text-white/20 text-[10px] uppercase tracking-[0.4em] flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© 2026 VERD Technologies • Agrarian Tech Stack • v1.0.4</p>
        <div className="flex gap-12 font-bold">
          <a href="#" className="hover:text-primary transition-colors">Neural API</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Shield</a>
          <a href="#" className="hover:text-primary transition-colors">Resilience Protocol</a>
        </div>
      </footer>
    </main>
  )
}
