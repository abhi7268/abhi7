'use client'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true) // Default dark rakhte hain

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'light') {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setDarkMode(true)
    }
  }

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-800 dark:bg-slate-200 text-yellow-500 dark:text-slate-900 transition-all"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}