'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { LayoutShell } from "@/components/layout-shell"
import { Camera, Loader2, Save, Lock, User as UserIcon, Mail, ShieldCheck } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Form States
  const [fullName, setFullName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        setFullName(currentUser.user_metadata?.full_name || "")
      }
    }
    getUser()
  }, [])

  // 📸 1. Profile Photo Upload Logic
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)

      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
      
      alert("Profile Picture Updated!")
      window.location.reload()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  // 📝 2. Name & Password Update Logic
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updates: any = { data: { full_name: fullName } }
      if (newPassword) {
        if (newPassword.length < 6) throw new Error("Password must be at least 6 characters")
        updates.password = newPassword
      }

      const { error } = await supabase.auth.updateUser(updates)
      if (error) throw error
      
      alert("Profile & Security settings updated!")
      setNewPassword("") 
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LayoutShell>
      <div className="max-w-5xl mx-auto space-y-10 pb-20 pt-4">
        <header>
          <h1 className="text-4xl font-black text-white tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium mt-2">Update your personal details and secure your account.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 🖼️ Left Sidebar: Avatar Management */}
          <div className="lg:col-span-4">
            <div className="bg-[#0f172a]/60 p-10 rounded-[3rem] border border-white/5 text-center sticky top-24 backdrop-blur-xl">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600/20 bg-slate-800 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(37,99,235,0.15)]">
                  {uploading ? (
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                  ) : user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <span className="text-4xl font-black text-white">{fullName.charAt(0) || "A"}</span>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full border-4 border-[#020617] hover:bg-blue-500 transition-all active:scale-90 shadow-xl"
                  title="Change Photo"
                >
                  <Camera size={18} className="text-white" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
              </div>
              <h2 className="mt-6 text-2xl font-black text-white">{fullName || "Abhishek Varma"}</h2>
              <div className="mt-2 flex items-center justify-center gap-2 text-slate-500">
                <Mail size={14} />
                <span className="text-xs font-bold tracking-tighter">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* 📝 Right Sidebar: Form Fields */}
          <div className="lg:col-span-8">
            <form onSubmit={handleUpdateProfile} className="bg-[#0f172a]/40 p-10 rounded-[3rem] border border-white/5 space-y-10 backdrop-blur-md">
              
              {/* Profile Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-blue-500">
                  <UserIcon size={20} />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em]">Public Profile</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-1">Display Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-5 text-sm text-white focus:border-blue-500/50 outline-none transition-all shadow-inner"
                    placeholder="Abhishek Varma"
                  />
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Security Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-500">
                  <ShieldCheck size={20} />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em]">Security & Privacy</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-1">Change Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-sm text-white focus:border-blue-500/50 outline-none transition-all shadow-inner"
                      placeholder="Enter new password (min 6 chars)"
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold ml-1">Leave empty if you don't want to change it.</p>
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="group w-full bg-white hover:bg-blue-500 hover:text-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] shadow-2xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} className="group-hover:animate-bounce" />}
                <span className="tracking-tight text-lg">Save Configuration</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </LayoutShell>
  )
}