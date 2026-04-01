import { useState, useEffect } from 'react'
import { MapPin, Activity, Droplets, Wind, ClipboardCheck, FlaskConical, Sprout, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { GlassCard } from './ui/GlassCard'
import { db, auth } from '../lib/firebase'
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore'
import DailyTip from './DailyTip'

export function GroundTruthInsights() {
  const [loading, setLoading] = useState(true)
  const [indexError, setIndexError] = useState<string | null>(null)
  const [userName, setUserName] = useState('User')
  const [location, setLocation] = useState('Savannah Belt')
  const [farmSize, setFarmSize] = useState('--')
  const [lastDisease, setLastDisease] = useState<string | null>(null)
  const [scanCount, setScanCount] = useState(0)

  useEffect(() => {
    const fetchInsightsData = async () => {
      if (!auth.currentUser) return

      try {
        setIndexError(null)
        // 1. Fetch User Profile
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserName(data.fullName?.split(' ')[0] || 'User')
          setLocation(data.location || 'Savannah Belt')
          setFarmSize(data.farmSize ? `${data.farmSize}ha` : '--')
        }

        // 2. Fetch Latest Scan Result & Count
        const scansRef = collection(db, 'scans')
        const q = query(
          scansRef,
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        )
        const querySnapshot = await getDocs(q)
        setScanCount(querySnapshot.size)
        
        if (!querySnapshot.empty) {
          setLastDisease(querySnapshot.docs[0].data().disease)
        }
      } catch (err: any) {
        console.error('Error fetching insights:', err)
        if (err.message?.includes('index')) {
          setIndexError('Insights require a database index. Please check the developer console.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchInsightsData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Aggregating Field Data...</p>
      </div>
    )
  }

  if (indexError) {
    return (
      <div className="max-w-2xl mx-auto pt-20">
        <GlassCard className="p-12 text-center border-amber-500/20 bg-amber-500/5">
          <div className="p-4 bg-amber-500/20 text-amber-500 rounded-3xl w-fit mx-auto mb-6">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-bold italic mb-4">Insights Unavailable</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            {indexError}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-[10px]"
          >
            Retry Sync
          </button>
        </GlassCard>
      </div>
    )
  }

  return (
    <section className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={<MapPin className="text-red-500" />} 
          label="Field Scope" 
          value={location} 
          subValue={`Size: ${farmSize}`} 
          delay={0.1}
        />
        <MetricCard 
          icon={<Activity className="text-emerald-500" />} 
          label="Diagnostics" 
          value={`${scanCount} Scans`} 
          subValue="Total Coverage" 
          delay={0.2}
        />
        <MetricCard 
          icon={<Droplets className="text-blue-500" />} 
          label="Hydration" 
          value="45%" 
          subValue="Savannah Zone" 
          delay={0.3}
        />
        <MetricCard 
          icon={<Wind className="text-orange-500" />} 
          label="Pathogen Risk" 
          value={lastDisease === 'Healthy' ? 'Low' : 'Elevated'} 
          subValue={lastDisease || 'No Data'} 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight italic">{userName}'s <span className="text-primary not-italic font-black uppercase">Interventions</span></h2>
          <h3 className="text-lg text-white/40 font-bold uppercase tracking-widest">Targeted Agronomy Protocol</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lastDisease && lastDisease !== 'Healthy' ? (
              <RecipeCard 
                title={`${lastDisease} Mitigation`}
                description={`Specific protocol for ${lastDisease} identified in your latest field diagnostic.`}
                ingredients={["Targeted Fungicide", "Copper-based Spray", "Pruning Shear Hook"]}
                impact="High Accuracy"
                icon={<FlaskConical className="text-purple-400" />}
              />
            ) : (
              <RecipeCard 
                title="Preventative Spore Guard"
                description="General airborne protection for healthy fields in the Savannah Belt."
                ingredients={["Neem Oil Solution", "Garlic Extract", "Water (1L)"]}
                impact="Maintenance"
                icon={<FlaskConical className="text-purple-400" />}
              />
            )}
            <RecipeCard 
              title="Soil Enrichment (K+)"
              description="Potassium-focused nutrient strategy for improved resistance."
              ingredients={["Wood Ash Extract", "Organic Mulch", "Compost Tea"]}
              impact="Soil Health"
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
            <ProtocolItem step="03" text="Check again in 2 days" />
            <ProtocolItem step="04" text="Save progress to your farm log" />
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
