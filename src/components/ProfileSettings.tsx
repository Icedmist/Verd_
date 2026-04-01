import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, MapPin, Phone, ShieldCheck, Save, Bell, Lock, Eye, EyeOff, Loader2, CheckCircle2, Sprout, History as HistoryIcon, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'
import { GlassCard } from './ui/GlassCard'
import { db, auth, storage } from '../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { compressImage } from '../lib/image-utils'

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<'info' | 'notifications' | 'security'>('info')
  const [isFarmer, setIsFarmer] = useState(true)
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Form States
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [farmName, setFarmName] = useState('')
  const [farmSize, setFarmSize] = useState('')
  const [farmRole, setFarmRole] = useState('Owner')
  const [cropTypes, setCropTypes] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return
      
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setFullName(data.fullName || auth.currentUser.displayName || '')
          setEmail(auth.currentUser.email || '')
          setLocation(data.location || '')
          setPhone(data.phone || '')
          setIsFarmer(data.isFarmer ?? true)
          setFarmName(data.farmName || '')
          setFarmSize(data.farmSize || '')
           setFarmRole(data.farmRole || 'Owner')
          setCropTypes(data.cropTypes || '')
          setProfilePictureUrl(data.profilePictureUrl || auth.currentUser.photoURL || null)
        } else {
          // Initialize with Auth defaults
          setFullName(auth.currentUser.displayName || '')
          setEmail(auth.currentUser.email || '')
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!auth.currentUser) return
    setIsLoading(true)
    setSaveSuccess(false)

    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        fullName,
        location,
        phone,
        isFarmer,
        farmName,
        farmSize,
        farmRole,
        cropTypes,
        profilePictureUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !auth.currentUser) return

    try {
      setIsUploading(true)
      const compressedBlob = await compressImage(file)
      const storageRef = ref(storage, `profiles/${auth.currentUser.uid}`)
      await uploadBytes(storageRef, compressedBlob)
      const downloadURL = await getDownloadURL(storageRef)
      setProfilePictureUrl(downloadURL)
    } catch (err) {
      console.error('Error uploading image:', err)
    } finally {
      setIsUploading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-24 px-4 md:px-0">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter italic mb-2">Account <span className="text-primary not-italic font-black">SETTINGS</span></h1>
        <p className="text-white/40 text-sm">Manage your agricultural profile and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-1 space-y-4">
          <GlassCard className="p-6 border-white/5 bg-white/5">
            <div className="flex flex-col items-center text-center">
              <div 
                onClick={() => document.getElementById('profile-upload')?.click()}
                className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-4 relative cursor-pointer group/avatar overflow-hidden"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin text-primary" size={24} />
                ) : profilePictureUrl ? (
                  <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="md:size-[40px] text-primary" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white uppercase tracking-widest">Change</span>
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-black rounded-full border-2 border-[#0d0f14] z-10">
                  <ShieldCheck size={10} />
                </div>
              </div>
              <input 
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <h3 className="font-bold text-lg">{fullName || 'User'}</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{isFarmer ? 'Premium Farmer' : 'Visual Explorer'}</p>
            </div>
            
            <nav className="mt-8 space-y-1 md:space-y-2 flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar -mx-2 md:mx-0 px-2 md:px-0">
              <button 
                onClick={() => setActiveTab('info')}
                className={cn(
                  "flex-shrink-0 md:w-full text-left px-4 py-2.5 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-3 transition-all",
                  activeTab === 'info' ? "bg-primary text-black" : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                <User size={14} className="md:size-[16px]" /> <span className="whitespace-nowrap">Personal Info</span>
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={cn(
                  "flex-shrink-0 md:w-full text-left px-4 py-2.5 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-3 transition-all",
                  activeTab === 'notifications' ? "bg-primary text-black" : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                <Bell size={14} className="md:size-[16px]" /> <span className="whitespace-nowrap">Notifications</span>
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={cn(
                  "flex-shrink-0 md:w-full text-left px-4 py-2.5 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-3 transition-all",
                  activeTab === 'security' ? "bg-primary text-black" : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                <Lock size={14} className="md:size-[16px]" /> <span className="whitespace-nowrap">Security</span>
              </button>
            </nav>
          </GlassCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'info' && (
            <GlassCard className="p-6 md:p-8 border-white/5 bg-white/5">
              <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 italic">Personal Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="email" 
                      readOnly
                      value={email}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 opacity-50 cursor-not-allowed outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Savannah Belt"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Farm Name</label>
                  <div className="relative">
                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Green Valley Estate"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Farm Size (Hectares)</label>
                  <div className="relative">
                    <HistoryIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="number" 
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Your Role</label>
                  <div className="relative">
                    <select 
                      value={farmRole}
                      onChange={(e) => setFarmRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm appearance-none"
                    >
                      <option value="Owner" className="bg-[#0d0f14]">Farm Owner</option>
                      <option value="Manager" className="bg-[#0d0f14]">Estate Manager</option>
                      <option value="Agronomist" className="bg-[#0d0f14]">Consulting Agronomist</option>
                      <option value="Worker" className="bg-[#0d0f14]">Field Specialist</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Principal Crops</label>
                  <input 
                    type="text" 
                    value={cropTypes}
                    onChange={(e) => setCropTypes(e.target.value)}
                    placeholder="e.g. Maize, Sorghum, Cowpea"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm">Professional Farmer Status</h4>
                    <p className="text-[10px] text-white/40">Enable specialized agronomy tools and personalized advice.</p>
                  </div>
                  <button 
                    onClick={() => setIsFarmer(!isFarmer)}
                    className={`flex-shrink-0 w-12 h-6 rounded-full transition-all relative ${isFarmer ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isFarmer ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 size={18} />
                      SAVED
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          )}

          {activeTab === 'security' && (
            <GlassCard className="p-6 md:p-8 border-white/5 bg-white/5">
              <h3 className="text-xl font-bold mb-8 italic">Security Settings</h3>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Change Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPass ? "text" : "password"} 
                        placeholder="Current Password"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 focus:border-primary/50 outline-none transition-all font-mono text-sm"
                      />
                      <button
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      >
                        {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <input 
                          type={showNewPass ? "text" : "password"} 
                          placeholder="New Password"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 focus:border-primary/50 outline-none transition-all font-mono text-sm"
                        />
                        <button
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                          {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <input 
                        type={showNewPass ? "text" : "password"} 
                        placeholder="Confirm New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-primary/50 outline-none transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                      <p className="text-[10px] text-white/40">Add a second layer of security to your account.</p>
                    </div>
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-red-400">Delete Account</h4>
                      <p className="text-[10px] text-white/40 italic">Permanently remove your account and all field data.</p>
                    </div>
                    <button className="px-4 py-2 bg-red-400/10 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-400/20 transition-all border border-red-400/20">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                  <Save size={18} />
                  Update Security
                </button>
              </div>
            </GlassCard>
          )}

          {activeTab === 'notifications' && (
            <GlassCard className="p-8 border-white/5 bg-white/5">
              <h3 className="text-xl font-bold mb-8 italic">Notice Preferences</h3>
              <p className="text-white/40 text-sm italic">You currently have all field notices enabled.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
