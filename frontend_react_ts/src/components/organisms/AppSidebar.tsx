import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus, PanelLeftClose, PanelLeftOpen, MessageSquare, Sparkles, Settings, LogOut } from 'lucide-react'
import { BrandLogo } from '@/components/atoms/BrandLogo'
import { useFragments } from '@/features/fragments/hooks/useFragments'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'

interface AppSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { data: fragments } = useFragments()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast('Signed out.', 'info')
    navigate('/')
  }

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-14 px-3.5 flex items-center justify-between border-b border-zinc-900">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 group cursor-pointer">
            <BrandLogo size="sm" showSubBrand={false} href="/app" />
            <button
              onClick={onToggleCollapse}
              className="p-1.5 ml-auto text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
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

      {/* New Fragment Action */}
      <div className="p-3">
        <Link
          to="/app"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-medium transition-all shadow-sm group ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="New Fragment"
        >
          <Plus className="w-4 h-4 text-pink-400 group-hover:rotate-90 transition-transform duration-200" />
          {!isCollapsed && <span>New Fragment</span>}
        </Link>
      </div>

      {/* Scrollable Fragments List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin">
        {!isCollapsed && (
          <div className="px-2.5 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
            Recent Thoughts
          </div>
        )}

        {fragments && fragments.length > 0 ? (
          fragments.map((frag) => {
            const isActive = location.pathname === `/app/fragments/${frag.id}`
            return (
              <Link
                key={frag.id}
                to={`/app/fragments/${frag.id}`}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors group relative ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 font-medium border border-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
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
              No thoughts yet.
            </div>
          )
        )}
      </div>

      {/* Thinker Profile Bottom Card */}
      <div className="p-2 border-t border-zinc-900">
        <div
          className={`flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 transition-colors ${
            isCollapsed ? 'justify-center p-2' : ''
          }`}
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover border border-zinc-700"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-pink-950/80 border border-pink-700/50 flex items-center justify-center text-[11px] font-mono text-pink-300">
              {(user?.fullname || user?.username || 'T').charAt(0).toUpperCase()}
            </div>
          )}

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate leading-none">
                {user?.fullname || user?.username}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono truncate mt-1">
                @{user?.username}
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
