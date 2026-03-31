import { MapPin, Activity, Droplets, Wind, ClipboardCheck, FlaskConical, Sprout } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { GlassCard } from './ui/GlassCard'

export function GroundTruthInsights() {
  return (
    <section className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={<MapPin className="text-red-500" />} 
          label="Region" 
          value="Regional Profile" 
          subValue="Savannah Belt" 
          delay={0.1}
        />
        <MetricCard 
          icon={<Activity className="text-emerald-500" />} 
          label="Soil Profile" 
          value="Loamy-Clay" 
          subValue="High Potassium" 
          delay={0.2}
        />
        <MetricCard 
          icon={<Droplets className="text-blue-500" />} 
          label="Humidity" 
          value="45%" 
          subValue="Semi-Arid" 
          delay={0.3}
        />
        <MetricCard 
          icon={<Wind className="text-orange-500" />} 
          label="Climate Var" 
          value="Sudano-Sahel" 
          subValue="Seasonal" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold tracking-tight">Active Interventions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecipeCard 
              title="Organic Fungicide Mix"
              description="Effective against Puccinia sorghi detected in regional biometric clusters."
              ingredients={["Neem Oil (50ml)", "Liquid Soap (10ml)", "Warm Water (1L)"]}
              impact="98% Efficiency"
              icon={<FlaskConical className="text-purple-400" />}
            />
            <RecipeCard 
              title="Nutrient Boost (K+)"
              description="Correcting potassium deficiency in sandy-loam transitions."
              ingredients={["Wood Ash (2kg)", "Compost Tea (5L)", "Mulch Layer"]}
              impact="Soil Recovery"
              icon={<Sprout className="text-green-400" />}
            />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1"
        >
          <GlassCard className="h-full rounded-[2rem] border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary">
              <ClipboardCheck size={24} />
            </div>
            <h3 className="text-xl font-bold">Field Protocol</h3>
          </div>
          <ul className="space-y-4">
            <ProtocolItem step="01" text="Verify leaf moisture before application" checked />
            <ProtocolItem step="02" text="Apply treatment during morning dew" checked />
            <ProtocolItem step="03" text="Monitor neural feedback in 48 hours" />
            <ProtocolItem step="04" text="Update ground-truth registry" />
          </ul>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}

function MetricCard({ icon, label, value, subValue, delay }: { icon: React.ReactNode, label: string, value: string, subValue: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="h-full"
    >
      <GlassCard className="h-full rounded-[2rem] p-6 hover:translate-y-[-4px] transition-transform border-white/5 hover:border-primary/30 group">
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className="text-white/40 text-sm mb-1">{label}</div>
      <div className="text-2xl font-bold mb-1 tracking-tight">{value}</div>
      <div className="text-white/20 text-[10px] uppercase tracking-widest font-bold">{subValue}</div>
      </GlassCard>
    </motion.div>
  )
}

function RecipeCard({ title, description, ingredients, impact, icon }: { title: string, description: string, ingredients: string[], impact: string, icon: React.ReactNode }) {
  return (
    <GlassCard className="rounded-3xl p-6 border-white/5 hover:border-primary/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-white/5">{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 rounded bg-primary/10 text-primary uppercase tracking-tighter">{impact}</span>
      </div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-sm text-white/60 mb-4 leading-relaxed">{description}</p>
      <div className="space-y-2">
        {ingredients.map((ing, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-white/40">
            <div className="h-1 w-1 rounded-full bg-primary" />
            {ing}
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function ProtocolItem({ step, text, checked }: { step: string, text: string, checked?: boolean }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <span className={cn("font-mono text-xs", checked ? "text-primary" : "text-white/20")}>{step}</span>
      <p className={cn("text-sm transition-colors", checked ? "text-white/90" : "text-white/40 group-hover:text-white/60")}>{text}</p>
    </div>
  )
}
