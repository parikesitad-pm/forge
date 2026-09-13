import React from 'react'
import { Sparkles, Star } from 'lucide-react'
import type { ObservationEntry } from '@/types/fragment.types'

interface ThoughtTimelineProps {
  entries: ObservationEntry[]
  onToggleSpark: (id: number, currentlyPinned: boolean) => void
  isSparkPending?: boolean
}

export const ThoughtTimeline: React.FC<ThoughtTimelineProps> = ({
  entries,
  onToggleSpark,
}) => {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-zinc-500 font-serif italic">
        Continue the thought below to begin exploring...
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {entries.map((entry) => {
        const isUser = entry.role === 'user'

        if (isUser) {
          return (
            <div
              key={entry.id}
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                <span className="text-zinc-400 font-medium">Thinker &middot; Reflection</span>
                <span>
                  {new Date(entry.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm sm:text-base text-zinc-200 font-serif leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          )
        }

        // Owl Observation Entry
        return (
          <div
            key={entry.id}
            className={`p-5 rounded-2xl border transition-all ${
              entry.pinned
                ? 'bg-amber-950/10 border-amber-500/30 shadow-lg shadow-amber-950/10'
                : 'bg-zinc-950/70 border-zinc-800/80'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-2">
              <span className="flex items-center gap-1.5 text-pink-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Owl &middot; Observer
              </span>
              <span className="text-zinc-500">
                {new Date(entry.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p className="text-sm sm:text-base text-zinc-200 font-serif leading-relaxed italic whitespace-pre-wrap">
              &ldquo;{entry.content}&rdquo;
            </p>

            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onToggleSpark(entry.id, entry.pinned)}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  entry.pinned
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 border border-zinc-700/50'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${entry.pinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                {entry.pinned ? '✦ Kept as Spark' : '✦ Keep as Spark'}
              </button>

              <span className="text-[11px] text-zinc-500 font-mono">
                {entry.pinned ? 'Marked as meaningful' : 'Observational note'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
