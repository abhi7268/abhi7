'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { BarChart3, BrainCircuit, Flame, ListTodo, Settings, LogOut, User as UserIcon } from "lucide-react";
import { ThemeTogglePlaceholder } from "@/components/theme-toggle-placeholder";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/problems", label: "Problems", icon: ListTodo },
  { href: "/mentor", label: "AI Mentor", icon: BrainCircuit },
  { href: "/streak", label: "Streak", icon: Flame },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      {/* 🧭 Horizontal Navbar (LeetCode Style) */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">CS</div>
              <span className="text-xl font-black text-white tracking-tighter">CodeSync</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href as any}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname === href ? "text-blue-500 bg-blue-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <ThemeTogglePlaceholder />
            {user && (
              <div className="h-9 w-9 rounded-full border-2 border-blue-500/20 overflow-hidden shadow-lg shadow-blue-500/10">
                <img src={user.user_metadata?.avatar_url} alt="User" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🖥️ Main Content Area (Full Width) */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6">
        {children}
      </main>
    </div>
  );
}