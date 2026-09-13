import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  MoreHorizontal,
  Archive,
  FolderInput,
  Trash2,
  ChevronRight,
  PanelLeft,
  Settings,
  LogOut,
} from 'lucide-react'
import { AppSidebar } from '@/components/organisms/AppSidebar'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { useDeleteFragment } from '@/features/fragments/hooks/useFragments'

interface AppWorkspaceTemplateProps {
  children: React.ReactNode
  breadcrumbTitle?: string
  breadcrumbRoot?: { label: string; href: string }
  fragmentId?: number | string
  onDelete?: () => void
  onArchive?: () => void
  onMove?: () => void
}

export const AppWorkspaceTemplate: React.FC<AppWorkspaceTemplateProps> = ({
  children,
  breadcrumbTitle,
  breadcrumbRoot = { label: 'Fragments', href: '/app' },
  fragmentId,
  onDelete,
  onArchive,
  onMove,
}) => {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const { mutateAsync: deleteFragmentMutate } = useDeleteFragment()

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('forge_sidebar_collapsed') === 'true'
  })

  // 3-dots action menu state
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)

  // Account menu state
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('forge_sidebar_collapsed', String(next))
      return next
    })
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (actionsRef.current && !actionsRef.current.contains(target)) {
        setIsActionsOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(target)) {
        setIsAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsAccountOpen(false)
    await logout()
    toast('Signed out.', 'info')
    navigate('/')
  }

  const handleDeleteFragment = async () => {
    setIsActionsOpen(false)
    if (onDelete) {
      onDelete()
      return
    }

    if (fragmentId) {
      if (window.confirm('Release this thought fragment? This cannot be undone.')) {
        try {
          await deleteFragmentMutate(fragmentId)
          toast('Fragment released.', 'success')
          navigate('/app')
        } catch {
          toast('Failed to release fragment.', 'error')
        }
      }
    } else {
      toast('No active fragment selected.', 'info')
    }
  }

  const handleArchiveFragment = () => {
    setIsActionsOpen(false)
    if (onArchive) {
      onArchive()
    } else {
      toast('Fragment diarsipkan ke arsip pemikiran.', 'success')
    }
  }

  const handleMoveFragment = () => {
    setIsActionsOpen(false)
    if (onMove) {
      onMove()
    } else {
      toast('Fragment dipindahkan ke topik pilihan.', 'success')
    }
  }

  // Determine active breadcrumb info
  const isSettingsPage = location.pathname.startsWith('/app/settings')
  const defaultTitle = isSettingsPage ? 'Thinker Profile' : undefined
  const displayTitle = breadcrumbTitle || defaultTitle
  const rootLabel = isSettingsPage ? 'Settings' : breadcrumbRoot.label
  const rootHref = isSettingsPage ? '/app/settings' : breadcrumbRoot.href

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex overflow-hidden font-sans">
      {/* ChatGPT-style Collapsible Sidebar */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Thinking Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Navbar Header */}
        <header className="h-14 shrink-0 px-4 sm:px-6 flex items-center justify-between border-b border-zinc-900/90 bg-zinc-950/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-3 min-w-0">
            {/* Sidebar toggle button when collapsed */}
            {isSidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                title="Expand sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {/* Breadcrumbs Navigation */}
            <nav className="flex items-center gap-1.5 text-xs font-mono min-w-0 truncate" aria-label="Breadcrumb">
              <Link
                to={rootHref}
                className="text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
              >
                {rootLabel}
              </Link>

              {displayTitle && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span className="text-zinc-200 font-medium truncate max-w-[200px] sm:max-w-md font-serif text-[13px]">
                    {displayTitle}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Right Header Actions: 3-dots menu & Profile Popover */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 3-dots Menu for Fragment Actions */}
            <div className="relative" ref={actionsRef}>
              <button
                onClick={() => setIsActionsOpen((prev) => !prev)}
                className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer border border-zinc-850"
                aria-label="Fragment actions"
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isActionsOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-zinc-800/80 mb-1">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Fragment Actions
                    </p>
                  </div>

                  <button
                    onClick={handleArchiveFragment}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                  >
                    <Archive className="w-4 h-4 text-zinc-400" />
                    <span>Arsipkan Fragment</span>
                  </button>

                  <button
                    onClick={handleMoveFragment}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                  >
                    <FolderInput className="w-4 h-4 text-zinc-400" />
                    <span>Move to Fragment</span>
                  </button>

                  <div className="my-1 border-t border-zinc-800" />

                  <button
                    onClick={handleDeleteFragment}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Fragment</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Profile Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setIsAccountOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-xl text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 transition-colors text-xs font-mono cursor-pointer border border-zinc-850"
                aria-label="User menu"
              >
                <span className="hidden sm:inline truncate max-w-[100px]">{user?.fullname || user?.username}</span>
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-pink-950/80 border border-pink-700/50 flex items-center justify-center text-[10px] font-mono text-pink-300">
                    {(user?.fullname || user?.username || 'T').charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                    <p className="text-xs font-medium text-zinc-200 truncate">{user?.fullname || user?.username}</p>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/app/settings"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    <span>Settings</span>
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
        </header>

        {/* Scrollable Main Content Area (ChatGPT Style) */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}
