import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MessageSquare, Trash2, ArrowUpRight } from 'lucide-react'
import { useFragments, useDeleteFragment } from '../hooks/useFragments'
import { useToast } from '@/app/providers/ToastProvider'
import { Spinner } from '@/components/atoms/Spinner'
import { FragmentListSkeleton } from '@/components/atoms/Skeleton'

export const FragmentList: React.FC = () => {
  const { data: fragments, isLoading, isError } = useFragments()
  const { mutateAsync: deleteFragment } = useDeleteFragment()
  const { toast } = useToast()

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Release this fragment? Its thoughts and observations will be cleared.')) return

    try {
      await deleteFragment(id)
      toast('Fragment released.', 'info')
    } catch {
      toast('Could not delete fragment', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-zinc-500">
          <Spinner size="sm" />
          <span>Synchronizing thinker fragments...</span>
        </div>
        <FragmentListSkeleton count={3} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-xs text-rose-400">
        Unable to load fragments. Please ensure you are logged in.
      </div>
    )
  }

  if (!fragments || fragments.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500 text-xs font-serif italic">
        No fragments captured yet. Capture your first thought above.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="flex items-center justify-between pb-2 text-xs font-mono text-zinc-500 border-b border-zinc-800/80">
        <span>Recent Fragments</span>
        <span>{fragments.length} total</span>
      </div>

      <div className="space-y-2.5">
        {fragments.map((fragment) => (
          <Link
            key={fragment.id}
            to={`/app/fragments/${fragment.id}`}
            className="group block p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/70 hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-zinc-200 font-serif leading-relaxed line-clamp-2 group-hover:text-pink-200 transition-colors">
                {fragment.seed}
              </p>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDelete(e, fragment.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors rounded"
                  title="Release Fragment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="p-1 text-zinc-400 group-hover:text-zinc-200">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-zinc-500" />
                {fragment.observations_count} entries
              </span>
              {fragment.sparks_count > 0 && (
                <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {fragment.sparks_count} sparks
                </span>
              )}
              <span className="ml-auto">
                {new Date(fragment.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
