import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  ShieldCheck, 
  Zap, 
  Leaf, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Calendar,
  MapPin,
  ClipboardCheck,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { GlassCard } from './ui/GlassCard'
import { cn } from '../lib/utils'
import { toPng } from 'html-to-image'

interface ScanData {
  id: string
  cropName: string
  disease: string
  confidence: number
  imageUrl: string
  timestamp: any
  recommendation?: string
  analysis?: string[]
}

export function ScanReport() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const reportRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<ScanData | null>(null)
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return
      try {
        const docRef = doc(db, 'scans', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.id ? { id: docSnap.id, ...docSnap.data() } as ScanData : null
          setReport(data)
          
          // Localization: Convert remote image to Data URL to bypass CORS during capture
          if (data?.imageUrl) {
            try {
              const res = await fetch(data.imageUrl, { mode: 'cors' })
              const blob = await res.blob()
              const reader = new FileReader()
              reader.onloadend = () => {
                setLocalImageUrl(reader.result as string)
              }
              reader.readAsDataURL(blob)
            } catch (imageErr) {
              console.warn('Failed to localize image (CORS). PNG generation might fail.', imageErr)
              setLocalImageUrl(data.imageUrl) // Fallback to remote URL
            }
          }
        }
      } catch (err) {
        console.error('Error fetching report:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [id])

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleDownloadCard = async () => {
    if (!reportRef.current) return
    setIsSharing(true)
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#0d0f14',
        pixelRatio: 2,
        style: {
          borderRadius: '0'
        }
      })
      const link = document.createElement('a')
      link.download = `verd-report-${report?.cropName}-${id?.slice(0, 5)}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error generating card:', err)
    } finally {
      setIsSharing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Generating Report...</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-24">
        <AlertTriangle className="mx-auto text-amber-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-white/40 mb-8">The scan record you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/history')}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Back to History
        </button>
      </div>
    )
  }

  const formattedDate = report.timestamp?.toDate 
    ? report.timestamp.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Unknown Date'

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 px-4 md:px-0">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/history')}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight italic">Scan <span className="text-primary not-italic font-black">REPORT</span></h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">ID: {id?.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleShareLink}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all relative overflow-hidden"
          >
            {copySuccess ? <CheckCircle2 size={14} className="text-primary" /> : <Share2 size={14} />}
            {copySuccess ? 'Link Copied' : 'Share Link'}
          </button>
          <button 
            onClick={handleDownloadCard}
            disabled={isSharing}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
          >
            {isSharing ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
            {isSharing ? 'Generating...' : 'Save as Card'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Report Card (The part that gets captured) */}
        <div className="lg:col-span-8">
          <div ref={reportRef} className="rounded-[32px] overflow-hidden border border-white/10 bg-[#0d0f14] shadow-2xl relative">
            {/* Design Elements for the PNG card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="p-8 md:p-12 space-y-12 relative z-10">
              {/* Branding and Info */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black italic shadow-lg shadow-primary/20">
                    V
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic tracking-tighter leading-none">VERD</h2>
                    <p className="text-[8px] font-bold text-primary uppercase tracking-[0.3em]">Agri-Neural Pathlogy</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Calendar size={12} className="text-white/20" />
                    <span className="text-[10px] font-bold text-white/60">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <MapPin size={12} className="text-white/20" />
                    <span className="text-[10px] font-bold text-white/60">Gombe, Savannah Belt</span>
                  </div>
                </div>
              </div>

              {/* Main Diagnostic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="aspect-square rounded-[24px] overflow-hidden border border-white/10 relative z-10 shadow-2xl bg-black/40">
                    {localImageUrl && (
                      <img 
                        src={localImageUrl} 
                        alt={report.cropName} 
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                        onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                        onError={(e) => {
                          if (localImageUrl !== report.imageUrl) {
                            console.warn('Local blob failed, falling back to direct URL.');
                            setLocalImageUrl(report.imageUrl);
                          }
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full w-fit mb-2 backdrop-blur-md">
                        <span className="text-[8px] font-bold text-primary uppercase tracking-widest">{report.cropName}</span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">{report.disease}</h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Diagnostic Confidence</p>
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-5xl font-black italic tracking-tighter text-primary">{(report.confidence * 100).toFixed(0)}%</span>
                      <ShieldCheck className="text-primary mb-2" size={24} />
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${report.confidence * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Zap className="text-primary mb-2" size={16} />
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-xs font-bold italic">Critical Alert</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Leaf className="text-emerald-400 mb-2" size={16} />
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Pathogen</p>
                      <p className="text-xs font-bold italic">Fungal/Viral</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pathological Insights */}
              <div className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="text-primary" size={20} />
                  <h4 className="text-lg font-bold italic">Pathological Analysis</h4>
                </div>
                <div className="space-y-4">
                  {(report.analysis || [
                    "Chlorotic lesions observed on foliar surfaces.",
                    "Evidence of localized necrotic tissue development.",
                    "Vascular restriction detected in proximity to lesion clusters."
                  ]).map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-white/70 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer QR Branding */}
            <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg">
                  {/* Mock QR */}
                  <div className="grid grid-cols-3 gap-0.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 ${[0, 2, 6, 8, 4].includes(i) ? 'bg-black' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Scan to verify</p>
                  <p className="text-[10px] font-bold text-primary italic">verd.agri/verify/{id?.slice(0, 8)}</p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-white/20 italic">#FeedTheFuture</p>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <GlassCard className="p-8 border-primary/20 bg-primary/5">
            <h4 className="text-lg font-bold mb-6 italic flex items-center gap-3">
              <ShieldCheck className="text-primary" size={20} />
              Intervention Plan
            </h4>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              {report.recommendation || "Applying a copper-based fungicide at 7-day intervals is recommended for current environmental conditions."}
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none mb-1">Isolate Infected Crops</p>
                  <p className="text-[10px] text-white/40">Prevent lateral transmission across fields.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none mb-1">Controlled Irrigation</p>
                  <p className="text-[10px] text-white/40">Reduce surface moisture to inhibit fungi.</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-12 py-3 bg-primary text-black rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
              Full Protocol
            </button>
          </GlassCard>

          <GlassCard className="p-8 border-white/5 bg-white/5">
             <h4 className="text-xs font-bold text-white/20 uppercase tracking-[0.2em] mb-6">Agronomy Support</h4>
             <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/20 transition-all">
                    <Info size={18} className="group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Consult Expert</p>
                    <p className="text-[10px] text-white/40">Chat with a licensed agronomist.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/20 transition-all">
                    <ExternalLink size={18} className="group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Scientific Library</p>
                    <p className="text-[10px] text-white/40">Read detailed pathogen research.</p>
                  </div>
                </div>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
