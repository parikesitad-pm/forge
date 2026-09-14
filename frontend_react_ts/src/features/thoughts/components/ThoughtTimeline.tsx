import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import type { ObservationEntry } from '@/types/fragment.types';

interface ThoughtTimelineProps {
  entries: ObservationEntry[];
  onToggleSpark: (id: number, currentlyPinned: boolean) => void;
  isSparkPending?: boolean;
}

export const ThoughtTimeline: React.FC<ThoughtTimelineProps> = ({
  entries,
  onToggleSpark,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const displayName = user?.fullname || user?.username || 'You';

  const handleCopy = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast('Tersalin ke clipboard', 'info');
      setTimeout(
        () => setCopiedId((prev) => (prev === id ? null : prev)),
        2000
      );
    } catch {
      toast('Gagal menyalin', 'error');
    }
  };

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-zinc-500 font-serif italic">
        Continue the thought below to begin exploring...
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {entries.map((entry) => {
        const isUser = entry.role === 'user';
        const isCopied = copiedId === entry.id;
        const timeString = new Date(entry.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={entry.id}
            className={`group relative p-4 rounded-2xl transition-all ${
              entry.pinned
                ? 'bg-amber-950/15 border border-amber-500/20 shadow-sm shadow-amber-950/20'
                : isUser
                  ? 'bg-zinc-900/40 hover:bg-zinc-900/60 border border-transparent'
                  : 'bg-zinc-950/60 hover:bg-zinc-950/90 border border-transparent'
            }`}
          >
            {/* Header: Author & Persistent Pinned Spark badge */}
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              {isUser ? (
                <span className="text-zinc-300 font-medium">{displayName}</span>
              ) : (
                <span className="flex items-center gap-1.5 text-pink-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Owl
                </span>
              )}

              {/* Persistent pinned spark indicator */}
              {entry.pinned && (
                <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                  ✦ Spark
                </span>
              )}
            </div>

            {/* Message Content */}
            <p
              className={`text-sm sm:text-base text-zinc-200 font-serif leading-relaxed whitespace-pre-wrap ${
                !isUser ? 'italic' : ''
              }`}
            >
              {!isUser ? `\u201C${entry.content}\u201D` : entry.content}
            </p>

            {/* Hover Actions: Spark icon button, Copy, Timestamp */}
            <div className="mt-2 pt-2 flex items-center justify-between text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 select-none">
              {/* Spark button: available on every thought */}
              <button
                type="button"
                onClick={() => onToggleSpark(entry.id, entry.pinned)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  entry.pinned
                    ? 'text-amber-300 bg-amber-500/20 hover:bg-amber-500/30'
                    : 'text-zinc-400 hover:text-amber-300 bg-zinc-850 hover:bg-zinc-800'
                }`}
                title={entry.pinned ? 'Lepaskan spark' : 'Jadikan spark'}
              >
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    entry.pinned ? 'text-amber-400 fill-amber-400' : ''
                  }`}
                />
                <span className="font-mono text-[11px]">Spark</span>
              </button>

              <div className="flex items-center gap-2.5 text-zinc-500">
                <span className="text-[11px] font-mono">{timeString}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(entry.id, entry.content)}
                  className="p-1 text-zinc-400 hover:text-zinc-100 rounded transition-colors cursor-pointer"
                  title="Copy thought"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
