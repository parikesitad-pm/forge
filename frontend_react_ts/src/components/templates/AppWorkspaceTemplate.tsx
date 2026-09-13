import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Settings, LogOut, Plus } from 'lucide-react'
import { BrandLogo } from '@/components/atoms/BrandLogo'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { Button } from '@/components/atoms/Button'

export const AppWorkspaceTemplate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
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

            <Link to="/app/settings" className="p-2 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/60 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>

            <div className="h-4 w-px bg-zinc-800" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-6 flex flex-col">
        {children}
      </main>
    </div>
  )
}
