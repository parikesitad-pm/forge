import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppWorkspaceTemplate } from '@/components/templates/AppWorkspaceTemplate'
import { useFragment } from '@/features/fragments/hooks/useFragments'
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
import { useToast } from '@/app/providers/ToastProvider'

export const FragmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: fragment, isLoading, isError } = useFragment(id)
  const { mutateAsync: addThought, isPending: isAddingThought } = useAddThought(id || '')
  const { mutateAsync: triggerObserve, isPending: isObserving } = useObserveFragment(id || '')
  const { mutate: toggleSpark } = useToggleSpark(id || '')
  const { toast } = useToast()

  const handleAddThought = async (content: string) => {
    if (!id) return
    try {
      await addThought(content)
      // Automatically invite Owl to observe after thinker enters a new thought
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

  if (isLoading) {
    return (
      <AppWorkspaceTemplate>
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-500">
          <Spinner size="md" />
          <span className="text-xs font-mono">Opening thought space...</span>
        </div>
      </AppWorkspaceTemplate>
    )
  }

  if (isError || !fragment) {
    return (
      <AppWorkspaceTemplate>
        <div className="py-16 text-center space-y-4">
          <p className="text-sm text-zinc-400">Fragment not found or has been released.</p>
          <Link to="/app" className="text-xs text-pink-400 hover:underline">
            &larr; Return to thinking workspace
          </Link>
        </div>
      </AppWorkspaceTemplate>
    )
  }

  return (
    <AppWorkspaceTemplate>
      <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto">
        {/* Navigation & Actions Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60 mb-6">
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Fragments
          </Link>

          <GrowthPanel fragmentId={fragment.id} />
        </div>

        {/* The Seed */}
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

        {/* Thought Composer */}
        <ThoughtComposer
          onSend={handleAddThought}
          isSubmitting={isAddingThought}
          disabled={isObserving}
        />
      </div>
    </AppWorkspaceTemplate>
  )
}
