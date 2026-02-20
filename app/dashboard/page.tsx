'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { LayoutShell } from "@/components/layout-shell"
import Link from "next/link"
import { 
  Flame, 
  Target, 
  Trophy, 
  Clock, 
  BrainCircuit, 
  Code2, 
  GraduationCap, 
  ChevronRight,
  Camera,
  Loader2
} from "lucide-react"

export default function DashboardPage() {
  const [solvedToday, setSolvedToday] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const today = new Date().toISOString().split('T')[0]
      const { count } = await supabase
        .from('all_problems')
        .select('*', { count: 'exact', head: true })
        .eq('is_solved', true)
        .gte('solved_at', today)

      setSolvedToday(count || 0)
      setCurrentStreak(2) 
      setLoading(false)
    }
    fetchDashboardData()
  }, [])

  // 📸 Profile Upload Logic
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      // A. Storage mein upload karein (Make sure 'avatars' bucket is Public)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // B. Public URL lein
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // C. User Metadata update karein
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (updateError) throw updateError
      
      window.location.reload() // Refresh to show new pic
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] text-blue-500 font-black tracking-[0.3em] animate-pulse">
      SYNCING HUB...
    </div>
  )

  const learningPaths = [
    { title: "DSA Mastery", slug: "dsa", desc: "LeetCode & Striver A2Z Mastery", progress: 33, total: 450, solved: 149, icon: BrainCircuit, color: "from-blue-600 to-indigo-600", bg: "bg-blue-500/10" },
    { title: "Full Stack Web", slug: "web-dev", desc: "Next.js, Supabase & Tailwind", progress: 65, total: 20, solved: 13, icon: Code2, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10" },
    { title: "BSSC Prep", slug: "bssc", desc: "Bihar SSC Syllabus & Mocks", progress: 15, total: 100, solved: 15, icon: GraduationCap, color: "from-orange-500 to-red-600", bg: "bg-orange-500/10" }
  ]

  return (
    <LayoutShell>
      <div className="max-w-[1250px] mx-auto space-y-10 pb-16">
        
        {/* 👤 Premium Welcome Header */}
        <div className="relative overflow-hidden bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <Trophy size={150} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Clickable Profile Image */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-24 h-24 rounded-full border-4 border-[#020617] overflow-hidden bg-slate-800 flex items-center justify-center shadow-2xl">
                {uploading ? (
                  <Loader2 className="animate-spin text-blue-500" />
                ) : user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span className="text-3xl font-black text-white">{user?.user_metadata?.full_name?.charAt(0) || "A"}</span>
                )}
                {/* Camera Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-[3px] border-[#0f172a]" />
              <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                Yo, {user?.user_metadata?.full_name?.split(' ')[0] || "Buddy"}! 👋
              </h1>
              <p className="text-slate-400 font-bold text-xs tracking-[0.2em] uppercase mt-3">
                Graduate 2024 | <span className="text-blue-500">Consistency is the only superpower ⚔️</span>
              </p>
            </div>
          </div>
        </div>

        {/* 📊 Horizontal Learning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path, i) => (
            <Link 
              href={`/dashboard/${path.slug}` as any} 
              key={i} 
              className="group block transform transition-all duration-500 hover:translate-y-[-5px]"
            >
              <div className="relative h-full bg-[#0f172a]/60 rounded-[2.5rem] p-8 border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-600/[0.02] transition-all overflow-hidden shadow-2xl">
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-4 rounded-[1.2rem] ${path.bg} text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500`}>
                    <path.icon size={26} />
                  </div>
                  <div className="text-slate-600 group-hover:text-blue-500 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
                <p className="text-slate-500 text-xs font-medium mb-8 leading-relaxed">{path.desc}</p>

                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-3xl font-black text-white tabular-nums">{path.solved}</span>
                    <span className="text-slate-600 font-bold text-[10px] ml-1.5 uppercase tracking-widest">/ {path.total}</span>
                  </div>
                  <div className="text-sm font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">{path.progress}%</div>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-white/5">
                  <div 
                    className={`h-full bg-gradient-to-r ${path.color} rounded-full transition-all duration-[1.5s] ease-out`}
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ⚔️ Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Daily Goal", val: `${solvedToday}/5`, icon: Target, color: "text-blue-400", bg: "bg-blue-400/5" },
            { label: "Streak", val: `${currentStreak} Days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/5" },
            { label: "Community", val: "Top 5%", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/5" },
            { label: "Focus Time", val: "4.5h", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/5" },
          ].map((stat, i) => (
            <div key={i} className={`p-7 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center transition-all hover:bg-white/5 group ${stat.bg}`}>
              <stat.icon className={`${stat.color} mb-3 group-hover:scale-125 transition-transform`} size={30} />
              <span className="text-2xl font-black text-white tabular-nums">{stat.val}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mt-3">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </LayoutShell>
  )
}