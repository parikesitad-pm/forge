import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MoreHorizontal,
  Archive,
  Trash2,
  Share2,
  Edit3,
  ChevronRight,
  PanelLeft,
  Layers,
} from 'lucide-react'
import { AppSidebar } from '@/components/organisms/AppSidebar'
import { useToast } from '@/app/providers/ToastProvider'
import {
  useDeleteFragment,
  useArchiveFragment,
} from '@/features/fragments/hooks/useFragments'
import { ForgeMomentOverlay } from '@/features/reflections/components/ForgeMomentOverlay'

interface AppWorkspaceTemplateProps {
  children: React.ReactNode
  breadcrumbTitle?: string
  breadcrumbRoot?: { label: string; href: string }
  fragmentId?: number | string
  onRename?: () => void
  onArchive?: () => void
  onShare?: () => void
  onDelete?: () => void
}

export const AppWorkspaceTemplate: React.FC<AppWorkspaceTemplateProps> = ({
  children,
  breadcrumbTitle,
  breadcrumbRoot = { label: 'Fragments', href: '/app' },
  fragmentId,
  onRename,
  onArchive,
  onShare,
  onDelete,
}) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { mutateAsync: deleteFragmentMutate } = useDeleteFragment()
  const { mutateAsync: archiveFragmentMutate } = useArchiveFragment()

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('forge_sidebar_collapsed') === 'true'
  })

  // Scroll state for header shrink animation
  const [isScrolled, setIsScrolled] = useState(false)

  // 3-dots action menu state
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)

  // Archive view toggle
  const [isArchiveView, setIsArchiveView] = useState(false)

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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDeleteFragment = async () => {
    setIsActionsOpen(false)
    if (onDelete) {
      onDelete()
      return
    }

    if (fragmentId) {
      if (window.confirm('Permanently delete this thought fragment? This cannot be undone.')) {
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

  const handleArchiveFragment = async () => {
    setIsActionsOpen(false)
    if (onArchive) {
      onArchive()
      return
    }

    if (fragmentId) {
      try {
        await archiveFragmentMutate(fragmentId)
        toast('Fragment archived.', 'success')
        navigate('/app')
      } catch {
        toast('Failed to archive fragment.', 'error')
      }
    }
  }

  const handleRename = () => {
    setIsActionsOpen(false)
    onRename?.()
  }

  const handleShare = () => {
    setIsActionsOpen(false)
    onShare?.()
  }

  const isFragmentActive = !!fragmentId

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex overflow-hidden font-sans">
      <ForgeMomentOverlay />

      {/* ChatGPT-style Collapsible Sidebar */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isArchiveView={isArchiveView}
        onToggleArchiveView={(active) => setIsArchiveView(active)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Animated Shrinking Top Header (No Harsh Lines) */}
        <header
          className={`sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ease-out backdrop-blur-md ${
            isScrolled
              ? 'h-11 bg-zinc-950/95 shadow-lg shadow-black/40'
              : 'h-14 bg-zinc-950/80'
          }`}
        >
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
            <nav
              className="flex items-center gap-1.5 text-xs font-mono min-w-0 truncate"
              aria-label="Breadcrumb"
            >
              <Link
                to={breadcrumbRoot.href}
                className="text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
              >
                {breadcrumbRoot.label}
              </Link>

              {breadcrumbTitle && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span className="text-zinc-200 font-medium truncate max-w-[180px] sm:max-w-md font-serif text-[13px]">
                    {breadcrumbTitle}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Right Header Actions per spec:
              [Share] [Archive] [All thoughts icon] [•••]
          */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {isFragmentActive && onShare && (
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                title="Share fragment publicly"
              >
                <Share2 className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden sm:inline font-mono text-[11px]">Share</span>
              </button>
            )}

            {isFragmentActive && onArchive && (
              <button
                onClick={handleArchiveFragment}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                title="Archive thought"
              >
                <Archive className="w-3.5 h-3.5 text-amber-400/80" />
                <span className="hidden sm:inline font-mono text-[11px]">Archive</span>
              </button>
            )}

            {/* All Thoughts Icon immediately before ••• menu */}
            <Link
              to="/app"
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
              title="All thoughts / fragments"
              aria-label="All thoughts"
            >
              <Layers className="w-4 h-4" />
            </Link>

            {/* 3-dots Menu for Fragment Actions */}
            {isFragmentActive && (
              <div className="relative" ref={actionsRef}>
                <button
                  onClick={() => setIsActionsOpen((prev) => !prev)}
                  className="p-1.5 sm:p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                  aria-label="Fragment options"
                  title="Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {isActionsOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1.5 mb-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Fragment Actions
                      </p>
                    </div>

                    {onRename && (
                      <button
                        onClick={handleRename}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-zinc-400" />
                        <span>Rename Display Title</span>
                      </button>
                    )}

                    <button
                      onClick={handleArchiveFragment}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                    >
                      <Archive className="w-4 h-4 text-amber-400/80" />
                      <span>Archive Fragment</span>
                    </button>

                    {onShare && (
                      <button
                        onClick={handleShare}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-pink-400" />
                        <span>Share Fragment</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-zinc-800/60" />

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
            )}
          </div>
        </header>

        {/* Scrollable Main Content Area with scroll detection */}
        <div
          onScroll={(e) => {
            setIsScrolled(e.currentTarget.scrollTop > 20)
          }}
          className="flex-1 overflow-y-auto flex flex-col scrollbar-thin"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
