import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Settings, LogOut, Plus, BookOpen, ChevronDown } from 'lucide-react'
import { BrandLogo } from '@/components/atoms/BrandLogo'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { Button } from '@/components/atoms/Button'

export const AppWorkspaceTemplate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsMenuOpen(false)
    await logout()
    toast('Signed out.', 'info')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* App Workspace Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/60">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <BrandLogo size="sm" showSubBrand href="/app" />
          </div>

          <div className="flex items-center gap-3">
            <Link to="/app">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5 text-xs text-zinc-300">
                <Plus className="w-3.5 h-3.5" />
                New Fragment
              </Button>
            </Link>

            <Link
              to="/docs"
              className="p-2 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/60 transition-colors hidden sm:flex items-center gap-1.5 text-xs"
              title="Documentation"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-zinc-400 font-sans">Docs</span>
            </Link>

            <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

            {/* Account Popover Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors text-xs font-mono cursor-pointer border border-zinc-800/60"
                aria-label="User menu"
              >
                <span>{user?.username || 'Thinker'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                    <p className="text-xs font-medium text-zinc-200">{user?.fullname || user?.username}</p>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/app/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    to="/docs"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-zinc-400" />
                    <span>Documentation</span>
                  </Link>

                  <div className="my-1 border-t border-zinc-800" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-6 flex flex-col">
        {children}
      </main>

      {/* Subtle Workspace Micro-Footer */}
      <footer className="border-t border-zinc-900 py-6 px-6 text-center text-[11px] text-zinc-600 font-mono">
        <p>Forge &middot; A Thinking Companion</p>
        <p className="mt-0.5 text-zinc-500">
          crafted with &lt;3 by parikesitad-pm &copy; 2026 MODULA Project &middot; MIT License
        </p>
      </footer>
    </div>
  )
}
