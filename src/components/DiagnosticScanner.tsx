import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Camera, Upload, CheckCircle2, AlertTriangle, ScanLine } from 'lucide-react'
import { toPng } from 'html-to-image'
import { cn } from '../lib/utils'
import { GlassCard } from './ui/GlassCard'
import { ResultShareCard } from './ui/ResultShareCard'
import { db, auth } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { analyzeCrop } from '../lib/Gemini'

export function DiagnosticScanner({ theme }: { theme: 'bitget' | 'greenfamily' }) {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<null | 'complete'>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveResult = async (aiData: any) => {
    if (!auth.currentUser) return
    try {
      await addDoc(collection(db, 'scans'), {
        userId: auth.currentUser.uid,
        cropName: aiData.cropName,
        disease: aiData.disease,
        confidence: aiData.confidence,
        recommendation: aiData.recommendation,
        timestamp: serverTimestamp(),
        theme
      })
    } catch (err) {
      console.error('Error saving scan:', err)
    }
  }

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    setResult(null)
    setProgress(30)

    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1]
        setProgress(60)
        
        const data = await analyzeCrop(base64)
        setAnalysis(data)
        await saveResult(data)
        
        setProgress(100)
        setScanning(false)
        setResult('complete')
      } catch (err) {
        console.error("Gemini Scan Failed:", err)
        setScanning(false)
        setProgress(0)
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleShare = async () => {
    if (shareCardRef.current === null) return
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        backgroundColor: '#000',
        pixelRatio: 2,
      })
      const link = document.createElement('a')
      link.download = `VERD-Result-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error generating image:', err)
    }
  }

  return (
    <GlassCard className="rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group border-white/5 hover:border-primary/20 transition-all">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        capture="environment" 
        onChange={handleImageCapture} 
      />

      <div className="absolute top-0 right-0 p-8 text-white/5 opacity-20 group-hover:opacity-40 transition-opacity">
        <Zap size={200} />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 tracking-tighter italic">Crop Health Scan</h2>
            <p className="text-white/60 leading-relaxed max-w-md">
              Use our smart assistant to check your plants for issues. It works instantly and understands your local crops.
            </p>
          </div>

          <div className="space-y-4">
            <div 
              className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/30 transition-all cursor-pointer group/scan" 
              onClick={triggerFilePicker}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/20 text-primary">
                    {scanning ? <ScanLine className="animate-pulse" /> : <Camera />}
                  </div>
                  <span className="font-bold text-lg">Start Scanning</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-white/40 group-hover/scan:text-white transition-colors">
                  <Upload size={18} />
                </div>
              </div>
              
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  className="h-full bg-primary shadow-[0_0_15px_rgba(108,58,250,0.5)]" 
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <span>{scanning ? 'Analyzing Plant...' : 'Ready to scan'}</span>
                <span>{progress}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ConfidenceMetric 
                label={analysis?.disease || "Detection"} 
                value={analysis?.confidence ? analysis.confidence * 100 : 0} 
                status={analysis?.confidence > 0.8 ? "Critical" : "Safe"} 
                delay={0.1} 
              />
              <ConfidenceMetric label="Status" value={result ? 100 : 0} status="Normal" delay={0.2} />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="aspect-square rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 hover:border-primary/40 hover:text-white/40 transition-all cursor-pointer"
                onClick={triggerFilePicker}
              >
                <div className="relative">
                  <Camera size={64} className="mb-4" />
                  {scanning && (
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(108,58,250,0.8)]"
                    />
                  )}
                </div>
                <p className="font-bold tracking-widest text-xs uppercase">Scan a Leaf to Begin</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 md:p-10 rounded-[3rem] bg-red-500/10 border border-red-500/20 backdrop-blur-3xl relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 text-red-500/5 rotate-12">
                  <AlertTriangle size={240} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6 font-mono text-red-500 font-bold text-sm">
                    <AlertTriangle size={18} />
                    <span>DISEASE ALERT [ACTION REQUIRED]</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">{analysis?.disease} Identified</h3>
                  <p className="text-white/80 mb-8 leading-relaxed text-lg">
                    We detected **{analysis?.disease}** on your {analysis?.cropName}. This requires immediate attention.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-[0_15px_40px_rgba(108,58,250,0.4)] flex items-center justify-center gap-2 group">
                      TREATMENT PLAN
                      <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="px-8 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                    >
                      SHARE
                    </button>
                  </div>

                  <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                    <ResultShareCard 
                      ref={shareCardRef}
                      cropName={analysis?.cropName}
                      disease={analysis?.disease}
                      confidence={analysis?.confidence * 100}
                      recommendation={analysis?.recommendation}
                      theme={theme}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  )
}

function ConfidenceMetric({ label, value, status, delay }: { label: string, value: number, status: string, delay: number }) {
  const isCritical = status === 'Critical'
  const isWarning = status === 'Warning'
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
    >
      <div className="text-[10px] text-white/40 mb-1 uppercase font-bold tracking-widest">{label}</div>
      <div className={cn("text-2xl font-mono font-bold tracking-tighter", isCritical && "text-red-500", isWarning && "text-orange-400", !isCritical && !isWarning && "text-emerald-500")}>
        {value.toFixed(1)}%
      </div>
    </motion.div>
  )
          }
