import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppWorkspaceTemplate } from '@/components/templates/AppWorkspaceTemplate';
import {
  useFragment,
  useDeleteFragment,
  useArchiveFragment,
} from '@/features/fragments/hooks/useFragments';
import {
  useAddThought,
  useObserveFragment,
  useToggleSpark,
} from '@/features/thoughts/hooks/useThoughtTimeline';
import { SeedHeader } from '@/features/thoughts/components/SeedHeader';
import { ThoughtTimeline } from '@/features/thoughts/components/ThoughtTimeline';
import { ThoughtComposer } from '@/features/thoughts/components/ThoughtComposer';
import { OwlThinkingState } from '@/features/owl/components/OwlThinkingState';
import { GrowthPanel } from '@/features/growth/components/GrowthPanel';
import { Spinner } from '@/components/atoms/Spinner';
import { ThoughtDetailSkeleton } from '@/components/atoms/Skeleton';
import { useToast } from '@/app/providers/ToastProvider';
import { ShareFragmentModal } from '@/components/organisms/ShareFragmentModal';
import { RenameFragmentModal } from '@/components/organisms/RenameFragmentModal';

export const FragmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: fragment, isLoading, isError } = useFragment(id);
  const { mutateAsync: addThought, isPending: isAddingThought } = useAddThought(
    id || ''
  );
  const { mutateAsync: triggerObserve, isPending: isObserving } =
    useObserveFragment(id || '');
  const { mutate: toggleSpark } = useToggleSpark(id || '');
  const { mutateAsync: deleteFragment } = useDeleteFragment();
  const { mutateAsync: archiveFragment } = useArchiveFragment();
  const { toast } = useToast();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const timelineEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of thoughts when new entries arrive
  useEffect(() => {
    if (fragment?.entries?.length) {
      timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [fragment?.entries?.length, isObserving]);

  const handleAddThought = async (content: string) => {
    if (!id) return;
    try {
      await addThought(content);
      triggerObserve().catch(() => {
        // Fallback handled in service
      });
    } catch {
      toast('Failed to record thought', 'error');
    }
  };

  const handleToggleSpark = (
    observationId: number,
    currentlyPinned: boolean
  ) => {
    toggleSpark(
      { observationId, currentlyPinned },
      {
        onSuccess: () => {
          toast(
            currentlyPinned ? 'Spark released.' : 'Kept as Spark. ✦',
            'success'
          );
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!id) return;
    if (
      window.confirm(
        'Permanently release this thought fragment? This cannot be undone.'
      )
    ) {
      try {
        await deleteFragment(id);
        toast('Fragment released.', 'success');
        navigate('/app');
      } catch {
        toast('Failed to release fragment.', 'error');
      }
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    try {
      await archiveFragment(id);
      toast('Fragment archived to Archived Thoughts.', 'success');
      navigate('/app');
    } catch {
      toast('Failed to archive fragment.', 'error');
    }
  };

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
    );
  }

  if (isError || !fragment) {
    return (
      <AppWorkspaceTemplate breadcrumbTitle="Not Found">
        <div className="py-20 text-center space-y-4 px-4">
          <p className="text-sm text-zinc-400 font-serif">
            Fragment not found or has been released.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:underline font-mono"
          >
            <ArrowLeft className="w-3 h-3" /> Return to thinking workspace
          </Link>
        </div>
      </AppWorkspaceTemplate>
    );
  }

  const displayTitle =
    fragment.display_title || fragment.title || fragment.seed;

  return (
    <AppWorkspaceTemplate
      breadcrumbTitle={displayTitle}
      fragmentId={fragment.id}
      onRename={() => setIsRenameModalOpen(true)}
      onShare={() => setIsShareModalOpen(true)}
      onArchive={handleArchive}
      onDelete={handleDelete}
    >
      <div className="flex-1 flex flex-col h-full justify-between">
        {/* Scrollable Conversation Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 max-w-3xl w-full mx-auto space-y-4">
          {/* Top Growth synthesis trigger bar */}
          <div className="flex items-center justify-end pb-1">
            <GrowthPanel fragmentId={fragment.id} />
          </div>

          {/* Compact Sticky Seed Header with attached Active Sparks */}
          <SeedHeader
            seed={fragment.seed}
            title={fragment.title}
            createdAt={fragment.created_at}
            sparks={fragment.sparks}
          />

          {/* Thought Evolution Timeline with higher density styling */}
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

      {/* Share Modal */}
      <ShareFragmentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        fragment={fragment}
      />

      {/* Rename Modal */}
      <RenameFragmentModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        fragment={fragment}
      />
    </AppWorkspaceTemplate>
  );
};
