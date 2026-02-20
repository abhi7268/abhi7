'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { LayoutShell } from "@/components/layout-shell"
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  ExternalLink, 
  ArrowUpDown,
  Trophy 
} from "lucide-react"

export default function ProblemsPage() {
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All Topics")

  useEffect(() => {
    async function getProblems() {
      setLoading(true)
      const { data, error } = await supabase
        .from('all_problems')
        .select('*')
        .order('id', { ascending: true })

      if (!error) setProblems(data || [])
      setLoading(false)
    }
    getProblems()
  }, [])

  // 🔥 UPDATED FILTER LOGIC: Plural aur Singular dono ko handle karega
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Logic: Dono side ko lowercase karo aur check karo ki tab ka naam category ke andar hai ya nahi
    // Isse "Array" button "arrays" category ko bhi pakad lega
    const matchesTab = activeTab === "All Topics" || 
                       p.category?.toLowerCase().includes(activeTab.toLowerCase().replace('s', '')) ||
                       activeTab.toLowerCase().includes(p.category?.toLowerCase().replace('s', ''))
    
    return matchesSearch && matchesTab
  })

  // ✅ Topics updated to match your database style
  const topics = ["All Topics", "Arrays", "String", "Hash Table", "Math", "Algorithms"]

  return (
    <LayoutShell>
      <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
        
        {/* 🏆 Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy size={80} className="text-white" />
            </div>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Featured</p>
            <h3 className="text-xl font-black text-white mt-1">Daily Challenge ⚔️</h3>
            <button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg active:scale-95">
              Solve Now
            </button>
          </div>
          <div className="md:col-span-2 bg-[#1e293b] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Learning Path</p>
                <h3 className="text-xl font-black text-white mt-1">30 Days of JavaScript</h3>
                <p className="text-slate-500 text-xs mt-1">Consistency is your superpower, Abhishek! ⚔️</p>
             </div>
             <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl border border-white/10 transition-all">
               Start Learning
             </button>
          </div>
        </div>

        {/* 🏷️ Interactive Topic Filters - Ab 'Arrays' (Plural) ke saath */}
        <div className="flex flex-wrap gap-2 items-center">
          {topics.map((topic) => (
            <button 
              key={topic} 
              onClick={() => setActiveTab(topic)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                activeTab === topic 
                ? "bg-white text-black border-white shadow-lg shadow-white/10" 
                : "bg-slate-900/50 text-slate-400 border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* 🔍 Search Bar */}
        <div className="flex gap-4 items-center bg-[#0f172a]/80 p-4 rounded-2xl border border-white/5 sticky top-0 z-10 backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 outline-none"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 bg-slate-900 px-4 py-2.5 rounded-xl border border-white/5 text-slate-400">
            <Filter size={16} />
            <span className="text-xs font-bold">Filter</span>
          </div>
        </div>

        {/* 📋 Table */}
        <div className="bg-[#0f172a]/50 rounded-2xl border border-white/5 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-blue-500 font-black italic">
              <Loader2 className="animate-spin" size={40} />
              SYNCING PROGRESS...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 border-b border-white/5 text-[10px] uppercase font-black text-slate-500">
                  <tr>
                    <th className="p-4 w-16 text-center">Status</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Difficulty <ArrowUpDown size={10} className="inline ml-1" /></th>
                    <th className="p-4">Acceptance</th>
                    <th className="p-4">Category</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredProblems.length > 0 ? filteredProblems.map((prob) => (
                    <tr key={prob.id} className="border-b border-white/[0.03] hover:bg-blue-600/[0.03] group transition-colors">
                      <td className="p-4 text-center">
                        {prob.is_solved ? (
                          <CheckCircle2 className="text-emerald-500 mx-auto" size={18} />
                        ) : (
                          <Circle className="text-slate-800 mx-auto group-hover:text-slate-700" size={18} />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium tabular-nums">{prob.id}.</span>
                          <span className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                            {prob.title}
                          </span>
                          <ExternalLink size={12} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                          prob.difficulty?.toLowerCase() === "easy" ? "text-emerald-500" : 
                          prob.difficulty?.toLowerCase() === "medium" ? "text-yellow-500" : "text-red-500"
                        }`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-xs">{prob.acceptance || "50%"}</td>
                      <td className="p-4">
                        <span className="bg-slate-800/80 text-slate-400 px-2 py-1 rounded-md text-[9px] font-bold uppercase group-hover:text-slate-200">
                          {prob.category}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-slate-500 font-bold italic">
                        No problems found in "{activeTab}". Check Supabase for category: "arrays"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </LayoutShell>
  )
}