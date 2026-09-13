import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Sparkles,
  Settings,
  LogOut,
  Layers,
  Eye,
  TrendingUp,
  Archive,
} from 'lucide-react'
import { BrandLogo } from '@/components/atoms/BrandLogo'
import { useFragments } from '@/features/fragments/hooks/useFragments'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'

interface AppSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isArchiveView?: boolean
  onToggleArchiveView?: (active: boolean) => void
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isArchiveView = false,
  onToggleArchiveView,
}) => {
  const { data: fragments } = useFragments()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  // Archived fragment IDs stored in localStorage
  const [archivedIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('forge_archived_fragment_ids') || '[]')
    } catch {
      return []
    }
  })

  const handleLogout = async () => {
    await logout()
    toast('Signed out.', 'info')
    navigate('/')
  }

  // Filter fragments by archive status
  const visibleFragments = (fragments || []).filter((f) => {
    const isArchived = archivedIds.includes(f.id)
    return isArchiveView ? isArchived : !isArchived
  })

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-zinc-950 transition-all duration-300 ease-in-out z-40 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 1. Fixed Header: Logo & Collapse Button (Clean, No Borders) */}
      <div className="h-14 px-3.5 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 group cursor-pointer w-full">
            <Link to="/app" className="flex items-center gap-2" title="Forge Workspace">
              <BrandLogo size="sm" showSubBrand={false} />
            </Link>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 ml-auto text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Fixed Top Navigation: New Fragment, All Fragments, Observation, Growth, Archive */}
      <div className="px-2 py-1 space-y-1">
        {/* New Fragment Button */}
        <Link
          to="/app"
          onClick={() => onToggleArchiveView?.(false)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-900/70 hover:bg-zinc-850 text-zinc-200 text-xs font-medium transition-all group ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="New Fragment"
        >
          <Plus className="w-4 h-4 text-pink-400 group-hover:rotate-90 transition-transform duration-200 shrink-0" />
          {!isCollapsed && <span>New Fragment</span>}
        </Link>

        {/* All Fragments Link */}
        <Link
          to="/app"
          onClick={() => onToggleArchiveView?.(false)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
            !isArchiveView && location.pathname === '/app'
              ? 'bg-zinc-900 text-zinc-100 font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
          title="All Fragments"
        >
          <Layers className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
          {!isCollapsed && <span>All Fragments</span>}
        </Link>

        {/* Observation Link (Disabled for now) */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-zinc-600 opacity-50 cursor-not-allowed ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Observation (Coming Soon)"
        >
          <div className="flex items-center gap-2.5">
            <Eye className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Observation</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[9px] font-mono uppercase tracking-wider bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500">
              Soon
            </span>
          )}
        </div>

        {/* Growth Link (Disabled for now) */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-zinc-600 opacity-50 cursor-not-allowed ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Growth Synthesis (Coming Soon)"
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Growth</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[9px] font-mono uppercase tracking-wider bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500">
              Soon
            </span>
          )}
        </div>

        {/* Archive Section Button */}
        <button
          type="button"
          onClick={() => onToggleArchiveView?.(!isArchiveView)}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
            isArchiveView
              ? 'bg-amber-500/10 text-amber-300 font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
          title="Archive"
        >
          <div className="flex items-center gap-2.5">
            <Archive className="w-3.5 h-3.5 shrink-0 text-amber-400/80" />
            {!isCollapsed && <span>Archive</span>}
          </div>
          {!isCollapsed && archivedIds.length > 0 && (
            <span className="text-[10px] font-mono bg-zinc-850 px-1.5 py-0.5 rounded text-zinc-400">
              {archivedIds.length}
            </span>
          )}
        </button>
      </div>

      {/* 3. Middle Scrollable Section: Fragment List ("bejajarin dah ampe mabok") */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin">
        {!isCollapsed && (
          <div className="px-2.5 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium">
            {isArchiveView ? 'Archived Thoughts' : 'Recent Thoughts'}
          </div>
        )}

        {visibleFragments.length > 0 ? (
          visibleFragments.map((frag) => {
            const isActive = location.pathname === `/app/fragments/${frag.id}`
            return (
              <Link
                key={frag.id}
                to={`/app/fragments/${frag.id}`}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors group relative ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={frag.seed}
              >
                <MessageSquare
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-pink-400' : 'text-zinc-500 group-hover:text-zinc-400'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1 font-serif text-[12px] leading-snug">
                    {frag.seed}
                  </span>
                )}
                {!isCollapsed && frag.sparks_count > 0 && (
                  <Sparkles className="w-3 h-3 text-amber-400/80 shrink-0" />
                )}
              </Link>
            )
          })
        ) : (
          !isCollapsed && (
            <div className="px-3 py-6 text-center text-zinc-600 text-xs font-serif italic">
              {isArchiveView ? 'No archived fragments.' : 'No thoughts yet.'}
            </div>
          )
        )}
      </div>

      {/* 4. Fixed Bottom Section: Pinned User Profile (parikesit @username) */}
      <div className="p-2 shrink-0">
        <div
          className={`flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/30 hover:bg-zinc-900 transition-colors ${
            isCollapsed ? 'justify-center p-2' : ''
          }`}
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover"
              onError={(e) => {
                // Fallback if image path fails
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-pink-950/80 flex items-center justify-center text-[11px] font-mono text-pink-300">
              {(user?.fullname || user?.username || 'P').charAt(0).toUpperCase()}
            </div>
          )}

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate leading-none">
                {user?.fullname || 'parikesit'}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono truncate mt-1">
                @{user?.username || 'parikesitad-pm'}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <div className="flex items-center gap-0.5">
              <Link
                to="/app/settings"
                className="p-1 text-zinc-500 hover:text-zinc-300 rounded transition-colors"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-1 text-zinc-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
