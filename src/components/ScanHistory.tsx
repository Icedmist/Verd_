import { motion } from 'framer-motion'
import { History, Calendar, Search, Filter, ArrowUpRight, Download, MoreVertical } from 'lucide-react'
import { GlassCard } from './ui/GlassCard'
import { cn } from '../lib/utils'

export function ScanHistory() {
  const scans = [
    { id: '1', crop: 'Maize', disease: 'Healthy', date: 'Oct 12, 2026', confidence: '98%', status: 'success' },
    { id: '2', crop: 'Wheat', disease: 'Leaf Rust', date: 'Oct 10, 2026', confidence: '92%', status: 'alert' },
    { id: '3', crop: 'Soybean', disease: 'Blight', date: 'Oct 05, 2026', confidence: '89%', status: 'alert' },
    { id: '4', crop: 'Rice', disease: 'Healthy', date: 'Sep 28, 2026', confidence: '99%', status: 'success' },
    { id: '5', crop: 'Maize', disease: 'Stem Borer', date: 'Sep 20, 2026', confidence: '94%', status: 'alert' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter italic mb-2">Scan <span className="text-primary not-italic font-black">HISTORY</span></h1>
          <p className="text-white/40 text-sm">Review your past field diagnostics and health trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Search crops..."
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {scans.map((scan, idx) => (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-2 border-white/5 bg-white/5 hover:border-primary/20 transition-all group cursor-pointer">
              <div className="flex items-center gap-6 p-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <History size={24} />
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Crop</p>
                    <p className="text-sm font-bold">{scan.crop}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Diagnosis</p>
                    <p className={cn(
                      "text-sm font-bold",
                      scan.status === 'alert' ? 'text-amber-400' : 'text-primary'
                    )}>{scan.disease}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Date</p>
                    <div className="flex items-center gap-2 text-sm text-white/60 font-medium">
                      <Calendar size={14} /> {scan.date}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Confidence</p>
                    <p className="text-sm font-mono">{scan.confidence}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all">
                    <Download size={18} />
                  </button>
                  <div className="h-6 w-px bg-white/10" />
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg group-hover:bg-primary group-hover:text-black transition-all">
                    View Report <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button className="px-8 py-3 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all font-bold text-xs uppercase tracking-widest">
          Load More History
        </button>
      </div>
    </div>
  )
}
