import React, { useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppWorkspaceTemplate } from '@/components/templates/AppWorkspaceTemplate'
import { useFragment, useDeleteFragment } from '@/features/fragments/hooks/useFragments'
import {
  useAddThought,
  useObserveFragment,
  useToggleSpark,
} from '@/features/thoughts/hooks/useThoughtTimeline'
import { SeedHeader } from '@/features/thoughts/components/SeedHeader'
import { ThoughtTimeline } from '@/features/thoughts/components/ThoughtTimeline'
import { ThoughtComposer } from '@/features/thoughts/components/ThoughtComposer'
import { OwlThinkingState } from '@/features/owl/components/OwlThinkingState'
import { SparkPanel } from '@/features/sparks/components/SparkPanel'
import { GrowthPanel } from '@/features/growth/components/GrowthPanel'
import { Spinner } from '@/components/atoms/Spinner'
import { ThoughtDetailSkeleton } from '@/components/atoms/Skeleton'
import { useToast } from '@/app/providers/ToastProvider'

export const FragmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: fragment, isLoading, isError } = useFragment(id)
  const { mutateAsync: addThought, isPending: isAddingThought } = useAddThought(id || '')
  const { mutateAsync: triggerObserve, isPending: isObserving } = useObserveFragment(id || '')
  const { mutate: toggleSpark } = useToggleSpark(id || '')
  const { mutateAsync: deleteFragment } = useDeleteFragment()
  const { toast } = useToast()
  const timelineEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of thoughts when new entries arrive
  useEffect(() => {
    if (fragment?.entries?.length) {
      timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [fragment?.entries?.length, isObserving])

  const handleAddThought = async (content: string) => {
    if (!id) return
    try {
      await addThought(content)
      triggerObserve().catch(() => {
        // Fallback handled in service
      })
    } catch {
      toast('Failed to record thought', 'error')
    }
  }

  const handleToggleSpark = (observationId: number, currentlyPinned: boolean) => {
    toggleSpark(
      { observationId, currentlyPinned },
      {
        onSuccess: () => {
          toast(currentlyPinned ? 'Spark released.' : 'Kept as Spark. ✦', 'success')
        },
      }
    )
  }

  const handleDelete = async () => {
    if (!id) return
    if (window.confirm('Release this thought fragment? This cannot be undone.')) {
      try {
        await deleteFragment(id)
        toast('Fragment released.', 'success')
        navigate('/app')
      } catch {
        toast('Failed to release fragment.', 'error')
      }
    }
  }

  const handleArchive = () => {
    if (!id) return
    try {
      const existing: number[] = JSON.parse(
        localStorage.getItem('forge_archived_fragment_ids') || '[]'
      )
      const numericId = Number(id)
      if (!existing.includes(numericId)) {
        existing.push(numericId)
        localStorage.setItem('forge_archived_fragment_ids', JSON.stringify(existing))
      }
      toast('Fragment berhasil dipindahkan ke Archive.', 'success')
      navigate('/app')
    } catch {
      toast('Gagal mengarsipkan fragment', 'error')
    }
  }

  if (isLoading) {
    return (
      <AppWorkspaceTemplate breadcrumbTitle="Loading...">
        <div className="py-8 max-w-3xl w-full mx-auto px-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Spinner size="sm" />
            <span>Unfolding thought space...</span>
          </div>
          <ThoughtDetailSkeleton />
        </div>
      </AppWorkspaceTemplate>
    )
  }

  if (isError || !fragment) {
    return (
      <AppWorkspaceTemplate breadcrumbTitle="Not Found">
        <div className="py-20 text-center space-y-4 px-4">
          <p className="text-sm text-zinc-400 font-serif">Fragment not found or has been released.</p>
          <Link to="/app" className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:underline font-mono">
            <ArrowLeft className="w-3 h-3" /> Return to thinking workspace
          </Link>
        </div>
      </AppWorkspaceTemplate>
    )
  }

  return (
    <AppWorkspaceTemplate
      breadcrumbTitle={fragment.seed}
      fragmentId={fragment.id}
      onDelete={handleDelete}
      onArchive={handleArchive}
    >
      <div className="flex-1 flex flex-col h-full justify-between">
        {/* Scrollable Conversation Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-3xl w-full mx-auto space-y-6">
          {/* Growth Synthesis & Navigation Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Fragments
            </Link>

            <GrowthPanel fragmentId={fragment.id} />
          </div>

          {/* The Seed Header */}
          <SeedHeader seed={fragment.seed} createdAt={fragment.created_at} />

          {/* Retained Sparks Panel */}
          <SparkPanel sparks={fragment.sparks} />

          {/* Thought Evolution Timeline */}
          <ThoughtTimeline
            entries={fragment.entries}
            onToggleSpark={handleToggleSpark}
          />

          {/* Owl thinking indicator */}
          {isObserving && <OwlThinkingState />}

          {/* Scroll anchor */}
          <div ref={timelineEndRef} className="h-4" />
        </div>

        {/* ChatGPT-style Bottom-Fixed Flexible Composer & Micro-Footer */}
        <div className="shrink-0 z-20">
          <ThoughtComposer
            onSend={handleAddThought}
            isSubmitting={isAddingThought}
            disabled={isObserving}
          />
        </div>
      </div>
    </AppWorkspaceTemplate>
  )
}
