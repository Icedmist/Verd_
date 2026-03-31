import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, MapPin, Phone, ShieldCheck, Save, Bell, Lock } from 'lucide-react'
import { GlassCard } from './ui/GlassCard'

export function ProfileSettings() {
  const [isFarmer, setIsFarmer] = useState(true)

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div>
        <h1 className="text-5xl font-bold tracking-tighter italic mb-2">Account <span className="text-primary not-italic font-black">SETTINGS</span></h1>
        <p className="text-white/40 text-sm">Manage your agricultural profile and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <GlassCard className="p-6 border-white/5 bg-white/5">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-4 relative">
                <User size={40} className="text-primary" />
                <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-black rounded-full border-4 border-[#0d0f14]">
                  <ShieldCheck size={12} />
                </div>
              </div>
              <h3 className="font-bold text-lg">Alex Gardener</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Premium Farmer</p>
            </div>
            
            <nav className="mt-8 space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center gap-3">
                <User size={16} /> Personal Info
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-white/40 font-bold text-xs flex items-center gap-3 transition-colors">
                <Bell size={16} /> Notifications
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-white/40 font-bold text-xs flex items-center gap-3 transition-colors">
                <Lock size={16} /> Security
              </button>
            </nav>
          </GlassCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-8 border-white/5 bg-white/5">
            <h3 className="text-xl font-bold mb-8 italic">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text" 
                    defaultValue="Alex Gardener"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="email" 
                    defaultValue="alex@farm.tech"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text" 
                    defaultValue="Savannah Belt Region"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="tel" 
                    defaultValue="+1 234 567 8900"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Professional Farmer Status</h4>
                  <p className="text-[10px] text-white/40">Enable specialized agronomy tools and personalized advice.</p>
                </div>
                <button 
                  onClick={() => setIsFarmer(!isFarmer)}
                  className={`w-12 h-6 rounded-full transition-all relative ${isFarmer ? 'bg-primary' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isFarmer ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button className="flex items-center gap-2 px-8 py-3 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
