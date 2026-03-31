import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, X, Sprout, Zap, Shield, Microscope } from 'lucide-react'
import { cn } from '../lib/utils'

const steps = [
  {
    title: "Welcome to VERD",
    description: "Your smart assistant for better farming. We turn complex data into simple steps to help your crops thrive.",
    icon: <Sprout className="text-emerald-500" size={48} />,
    color: "emerald"
  },
  {
    title: "Smart Crop Scan",
    description: "Easily spot plant diseases and pests in seconds using your phone's camera. No internet? No problem.",
    icon: <Microscope className="text-blue-500" size={48} />,
    color: "blue"
  },
  {
    title: "Expert Advice",
    description: "Get precise, easy-to-follow steps and local 'recipes' to fix issues and protect your harvest.",
    icon: <Zap className="text-purple-500" size={48} />,
    color: "purple"
  },
  {
    title: "Safe & Secure",
    description: "Your farm data is private and secure, built with modern protection that works even when you're offline.",
    icon: <Shield className="text-red-500" size={48} />,
    color: "red"
  }
]

export function Onboarding({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card w-full max-w-2xl rounded-[3rem] overflow-hidden relative border-white/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="p-12 md:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 mb-4">
                {steps[currentStep].icon}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl font-bold tracking-tighter italic">
                  {steps[currentStep].title}
                </h3>
                <p className="text-xl text-white/60 leading-relaxed max-w-md">
                  {steps[currentStep].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-16 flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "h-1.5 w-8 rounded-full transition-all duration-500",
                    i === currentStep ? "bg-primary w-12" : "bg-white/10"
                  )}
                />
              ))}
            </div>

            <div className="flex gap-4">
              {currentStep > 0 && (
                <button 
                  onClick={prev}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <button 
                onClick={next}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-[0_10px_30px_rgba(108,58,250,0.3)]"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next Step"}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
