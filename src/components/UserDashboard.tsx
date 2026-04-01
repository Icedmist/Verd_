import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Zap, Bell, Calendar, ChevronRight, TrendingUp, Droplets, ThermometerSun, Loader2 } from 'lucide-react'
import { GlassCard } from './ui/GlassCard'
import { cn } from '../lib/utils'
import { db, auth } from '../lib/firebase'
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore'
import DailyTip from './DailyTip'

interface Scan {
  id: string
  cropName: string
  disease: string
  confidence: number
  userId: string
  timestamp: any
  time?: string
}

export function UserDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [indexError, setIndexError] = useState<string | null>(null)
  const [userName, setUserName] = useState('User')
  const [stats, setStats] = useState([
    { label: 'Field Health', value: '--', icon: <Activity size={20} />, color: 'text-emerald-400' },
    { label: 'Active Alerts', value: '0', icon: <Bell size={20} />, color: 'text-amber-400' },
    { label: 'Total Scans', value: '0', icon: <Zap size={20} />, color: 'text-primary' },
    { label: 'Soil Hydration', value: '78%', icon: <Droplets size={20} />, color: 'text-blue-400' },
  ])
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) return

      try {
        setIndexError(null)
        // 1. Fetch User Profile
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName || auth.currentUser.displayName || 'User')
        }

        // 2. Fetch Recent Scans
        const scansRef = collection(db, 'scans')
        const q = query(
          scansRef, 
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        )
        const querySnapshot = await getDocs(q)
        
        const scanData: Scan[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          time: doc.data().timestamp?.toDate().toLocaleDateString() || 'Recently'
        } as Scan))

        // 3. Update Activities
        const mappedActivities = scanData.map(scan => ({
          title: `${scan.cropName || 'Crop'} Scan Complete`,
          time: scan.time,
          status: scan.disease === 'Healthy' ? 'Healthy' : 'Action Required',
          type: scan.disease === 'Healthy' ? 'scan' : 'alert'
        }))
        setActivities(mappedActivities)

        // 4. Update Stats
        const totalScans = scanData.length
        const alerts = scanData.filter(s => s.disease !== 'Healthy').length
        
        setStats(prev => [
          { ...prev[0], value: '94%' },
          { ...prev[1], value: alerts.toString() },
          { ...prev[2], value: totalScans.toString() },
          prev[3],
        ])

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        if (err.message?.includes('index')) {
          setIndexError('The database requires a composite index to display your recent activity. Please click the link in your developer console to create it.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  if (indexError) {
    return (
      <div className="max-w-2xl mx-auto pt-20">
        <GlassCard className="p-12 text-center border-amber-500/20 bg-amber-500/5">
          <div className="p-4 bg-amber-500/20 text-amber-500 rounded-3xl w-fit mx-auto mb-6">
            <TrendingUp size={32} />
          </div>
          <h2 className="text-2xl font-bold italic mb-4">Database Synchronization Required</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            {indexError}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-[10px]"
          >
            I've Created the Index, Reload
          </button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4 text-primary font-bold tracking-widest text-[10px] uppercase">
            <ShieldCheck size={14} />
            Exclusive User Space
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter italic">
            Welcome <span className="text-white/20 not-italic font-black">{userName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className="p-3 bg-primary/20 text-primary rounded-xl">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none mb-1">Today's Cycle</p>
            <p className="text-sm font-bold font-mono">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mb-12">
        <DailyTip />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all flex flex-col gap-4">
              <div className={cn("p-2 rounded-lg bg-white/5 w-fit", stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold italic">Recent Activity</h3>
            <button 
              onClick={() => navigate('/history')}
              className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
            >
              View History <ChevronRight size={12} />
            </button>
          </div>
          
          <div className="space-y-3">
            {activities.length > 0 ? activities.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <GlassCard className="p-5 border-white/5 bg-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      activity.type === 'alert' ? 'bg-amber-400' : 'bg-emerald-400'
                    )} />
                    <div>
                      <p className="text-sm font-bold">{activity.title}</p>
                      <p className="text-[10px] text-white/40">{activity.time}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-white/60 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/20 transition-all">
                    {activity.status}
                  </div>
                </GlassCard>
              </motion.div>
            )) : (
              <p className="text-center py-12 text-white/20 italic text-sm">No recent activity found. Start a scan to begin.</p>
            )}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-8">
          <GlassCard className="p-8 border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp size={80} />
            </div>
            <h4 className="text-lg font-bold mb-2">Yield Prediction</h4>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Based on your current field diagnostics, we predict a 12% increase in harvest quality compared to last season.
            </p>
            <button className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
              Optimization Plan
            </button>
          </GlassCard>

          <GlassCard className="p-8 border-white/5 bg-white/5">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Live Sensors</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-400/10 text-blue-400 rounded-lg">
                    <Droplets size={16} />
                  </div>
                  <span className="text-xs font-bold">Moisture</span>
                </div>
                <span className="text-xs font-mono">42%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-400/10 text-orange-400 rounded-lg">
                    <ThermometerSun size={16} />
                  </div>
                  <span className="text-xs font-bold">Temp</span>
                </div>
                <span className="text-xs font-mono">28°C</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
