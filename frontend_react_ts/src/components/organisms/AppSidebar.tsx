import React, { useState, useRef, useEffect, useMemo } from 'react'
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
  ArchiveRestore,
  Trash2,
  ChevronsUpDown,
} from 'lucide-react'
import { BrandLogo } from '@/components/atoms/BrandLogo'
import {
  useFragments,
  useArchivedFragments,
  useRestoreFragment,
  useDeleteFragment,
} from '@/features/fragments/hooks/useFragments'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { SettingsModal } from '@/features/settings/components/SettingsModal'

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
  const { data: activeFragments } = useFragments()
  const { data: archivedFragments } = useArchivedFragments()
  const { mutateAsync: restoreMutate } = useRestoreFragment()
  const { mutateAsync: deleteMutate } = useDeleteFragment()

  const { user, logout } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  // Profile popover & settings modal state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const thinkerSince = useMemo(() => {
    if (!user?.created_at) return 'Thinker since 2026'
    try {
      const d = new Date(user.created_at)
      return `Thinker since ${d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
    } catch {
      return 'Thinker since 2026'
    }
  }, [user?.created_at])

  const handleLogout = async () => {
    await logout()
    toast('Signed out.', 'info')
    navigate('/')
  }

  const handleRestore = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await restoreMutate(id)
      toast('Fragment restored to active thinking space.', 'success')
    } catch {
      toast('Failed to restore fragment.', 'error')
    }
  }

  const handleDeletePermanent = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Permanently delete this archived fragment? This cannot be undone.')) {
      try {
        await deleteMutate(id)
        toast('Fragment permanently released.', 'success')
        if (location.pathname === `/app/fragments/${id}`) {
          navigate('/app')
        }
      } catch {
        toast('Failed to delete fragment.', 'error')
      }
    }
  }

  const fragmentsToDisplay = isArchiveView ? archivedFragments || [] : activeFragments || []
  const archivedCount = archivedFragments?.length || 0

  return (
    <>
      <aside
        className={`h-screen sticky top-0 flex flex-col bg-zinc-950 transition-all duration-300 ease-in-out z-40 select-none ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* 1. Header: Logo & Collapse Button */}
        <div className="h-14 px-3.5 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 group cursor-pointer w-full">
              <Link to="/app" className="flex items-center gap-2.5 flex-1 min-w-0">
                <BrandLogo size="sm" showSubBrand={false} />
                <span className="font-serif font-medium text-sm text-zinc-200 tracking-tight">
                  Forge
                </span>
              </Link>
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                title="Expand sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Top Action & Navigation */}
        <div className="p-2 space-y-1">
          {/* New Fragment Button */}
          <Link
            to="/app"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 hover:text-white transition-all cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="New Fragment"
          >
            <Plus className="w-4 h-4 shrink-0 text-pink-400" />
            {!isCollapsed && <span>New Fragment</span>}
          </Link>

          {/* All Fragments Link */}
          <Link
            to="/app"
            onClick={() => onToggleArchiveView?.(false)}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              !isArchiveView && location.pathname === '/app'
                ? 'bg-zinc-900 text-zinc-100 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="All Thoughts"
          >
            <Layers className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
            {!isCollapsed && <span>All Thoughts</span>}
          </Link>

          {/* Observation Link (Soon) */}
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

          {/* Growth Link (Soon) */}
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
                ? 'bg-amber-500/15 text-amber-300 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Archive"
          >
            <div className="flex items-center gap-2.5">
              <Archive className="w-3.5 h-3.5 shrink-0 text-amber-400/80" />
              {!isCollapsed && <span>Archived Fragments</span>}
            </div>
            {!isCollapsed && archivedCount > 0 && (
              <span className="text-[10px] font-mono bg-zinc-850 px-1.5 py-0.5 rounded text-zinc-400">
                {archivedCount}
              </span>
            )}
          </button>
        </div>

        {/* 3. Middle Scrollable Section: Fragment List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin">
          {!isCollapsed && (
            <div className="px-2.5 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-medium flex items-center justify-between">
              <span>{isArchiveView ? 'Archived Thoughts' : 'Active Thoughts'}</span>
              <span>{fragmentsToDisplay.length}</span>
            </div>
          )}

          {fragmentsToDisplay.length > 0
            ? fragmentsToDisplay.map((frag) => {
                const isActive = location.pathname === `/app/fragments/${frag.id}`
                const label = frag.display_title || frag.title || frag.seed

                return (
                  <div
                    key={frag.id}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors group relative ${
                      isActive
                        ? 'bg-zinc-900 text-zinc-100 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Link
                      to={`/app/fragments/${frag.id}`}
                      className="flex items-center gap-2.5 min-w-0 flex-1"
                      title={label}
                    >
                      <MessageSquare
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive
                            ? 'text-pink-400'
                            : 'text-zinc-500 group-hover:text-zinc-400'
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate flex-1 font-serif text-[12px] leading-snug">
                          {label}
                        </span>
                      )}
                    </Link>

                    {/* Sparks badge on active */}
                    {!isCollapsed && !isArchiveView && frag.sparks_count > 0 && (
                      <Sparkles className="w-3 h-3 text-amber-400/80 shrink-0 ml-1" />
                    )}

                    {/* Restore & Permanent Delete Actions for Archived Fragments */}
                    {!isCollapsed && isArchiveView && (
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                        <button
                          type="button"
                          onClick={(e) => handleRestore(frag.id, e)}
                          className="p-1 text-zinc-400 hover:text-emerald-300 rounded hover:bg-zinc-800"
                          title="Restore to active thoughts"
                        >
                          <ArchiveRestore className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeletePermanent(frag.id, e)}
                          className="p-1 text-zinc-400 hover:text-rose-400 rounded hover:bg-zinc-800"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            : !isCollapsed && (
                <div className="px-3 py-6 text-center text-zinc-600 text-xs font-serif italic">
                  {isArchiveView ? 'No archived fragments.' : 'No active thoughts yet.'}
                </div>
              )}
        </div>

        {/* 4. Bottom Section: Pinned Thinker Profile with Popover */}
        <div className="p-2 shrink-0 relative" ref={profileMenuRef}>
          {/* Profile popover when clicked */}
          {isProfileMenuOpen && (
            <div
              className={`absolute bottom-full mb-2 ${
                isCollapsed ? 'left-2 w-56' : 'left-2 right-2'
              } rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2`}
            >
              <div className="flex items-center gap-2.5 p-2 pb-2.5 border-b border-zinc-800/80">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-700/60"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-pink-950/80 border border-pink-500/30 flex items-center justify-center text-xs font-mono text-pink-300 shrink-0">
                    {user?.initials || 'TH'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-100 truncate">
                    {user?.display_calling_name || user?.preferred_name || user?.fullname || user?.username || 'Thinker'}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400 truncate">
                    @{user?.username || 'thinker'}
                  </p>
                </div>
              </div>

              <div className="pt-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    setIsSettingsModalOpen(true)
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile Trigger Button */}
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/30 hover:bg-zinc-900 transition-colors text-left cursor-pointer group ${
              isCollapsed ? 'justify-center p-2' : ''
            }`}
            title={isCollapsed ? `@${user?.username}` : undefined}
            aria-label="Thinker profile menu"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-zinc-700/60"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-pink-950/80 border border-pink-500/30 flex items-center justify-center text-[11px] font-mono text-pink-300 shrink-0">
                {user?.initials || 'TH'}
              </div>
            )}

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-medium text-zinc-200 truncate leading-none">
                  @{user?.username || 'thinker'}
                </p>
                <p className="text-[10px] text-zinc-500 font-sans truncate mt-1">
                  {thinkerSince}
                </p>
              </div>
            )}

            {!isCollapsed && (
              <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
            )}
          </button>
        </div>
      </aside>

      {/* Settings Modal (pops open in-place) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  )
}
