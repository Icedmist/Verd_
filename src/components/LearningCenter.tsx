import { motion } from 'framer-motion'
import { BookOpen, PlayCircle, Award, Compass, Search, ChevronRight, Sprout, Plane as Drone, Bug } from 'lucide-react'
import { GlassCard } from './ui/GlassCard'

export function LearningCenter() {
  const modules = [
    { title: 'Agronomy Fundamentals', lessonsCount: 12, icon: <Sprout size={24} />, progress: 65 },
    { title: 'Drone Diagnostics', lessonsCount: 8, icon: <Drone size={24} />, progress: 30 },
    { title: 'Pathology Masterclass', lessonsCount: 15, icon: <Bug size={24} />, progress: 0 },
  ]

  const featuredLesson = {
    title: 'Precision Spraying with Drones',
    description: 'Learn how to calibrate your VERD-enabled drones for precision application of organic pesticides.',
    time: '15 min',
    level: 'Advanced'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-bitget-turquoise">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter italic mb-2">Learning <span className="text-primary not-italic font-black">CENTER</span></h1>
          <p className="text-white/40 text-sm">Expand your expertise in AI-driven agronomy and drone tech.</p>
        </div>
        <div className="flex items-center gap-4">
          <GlassCard className="px-4 py-2 border-primary/20 bg-primary/5 flex items-center gap-3">
            <Award className="text-primary" size={20} />
            <div className="text-right">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Your Points</p>
              <p className="text-sm font-bold">1,240 XP</p>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Widget */}
          <GlassCard className="p-10 border-primary/20 bg-primary/5 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 blur-[100px] group-hover:bg-primary/20 transition-all" />
            <div className="relative z-10 flex flex-col items-start gap-6">
              <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                Featured Module
              </div>
              <h2 className="text-3xl font-bold italic leading-tight max-w-lg">{featuredLesson.title}</h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">{featuredLesson.description}</p>
              <div className="flex items-center gap-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <span className="flex items-center gap-2"><PlayCircle size={14} className="text-primary" /> {featuredLesson.time} Video</span>
                <span className="flex items-center gap-2"><Award size={14} className="text-primary" /> {featuredLesson.level}</span>
              </div>
              <button className="px-8 py-3 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-transform active:scale-95">
                Start Learning
              </button>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod, idx) => (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/5 text-primary rounded-2xl">
                      {mod.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">{mod.lessonsCount} LESSONS</p>
                      <p className="text-xs font-bold text-white/60">Module {idx + 1}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-4">{mod.title}</h3>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${mod.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className="h-full bg-primary" 
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                      <span>{mod.progress}% Complete</span>
                      <span className="text-primary/60 hover:text-primary transition-colors cursor-pointer flex items-center gap-1">Continue <ChevronRight size={10} /></span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <GlassCard className="p-8 border-white/5 bg-white/5">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Compass size={14} className="text-primary" /> Curated Paths
            </h4>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <p className="text-xs font-bold mb-1 group-hover:text-primary transition-colors">Digital Soil Profiling</p>
                <p className="text-[10px] text-white/40 leading-relaxed">Master the art of reading soil health from spectral imagery.</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-xs font-bold mb-1 group-hover:text-primary transition-colors">Pest Management 2.0</p>
                <p className="text-[10px] text-white/40 leading-relaxed">Integrated pest control in the AI era.</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-xs font-bold mb-1 group-hover:text-primary transition-colors">Economic Agronomy</p>
                <p className="text-[10px] text-white/40 leading-relaxed">Maximizing ROI through precision technology.</p>
              </div>
            </div>
            <button className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white/40">
              Browse All Paths
            </button>
          </GlassCard>

          <GlassCard className="p-8 border-white/5 bg-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
              <BookOpen size={120} />
            </div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Daily Tip</h4>
            <p className="text-sm italic leading-relaxed text-white/80">
              "Did you know? Morning scans often yield 15% higher spectral accuracy due to lower atmospheric turbulence."
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
