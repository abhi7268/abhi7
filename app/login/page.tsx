'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  // 1. Purana Email/Password Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard') // Home ki jagah Dashboard par bhejein
    }
  }

  // 2. Naya Google Login Logic
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) alert(error.message)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm space-y-6 bg-slate-900 p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight">Mastery Arena ⚔️</h2>
          <p className="text-slate-400 text-sm mt-1">Level Up Your Coding Journey</p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black p-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
          Continue with Google
        </button>

        <div className="relative flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase py-2">
          <div className="h-[1px] bg-slate-800 flex-1"></div>
          OR
          <div className="h-[1px] bg-slate-800 flex-1"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-xl bg-slate-800 border border-white/5 focus:outline-none focus:border-blue-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-slate-800 border border-white/5 focus:outline-none focus:border-blue-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}