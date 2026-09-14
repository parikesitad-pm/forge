import React, { useState } from 'react';
import { Sprout, Sparkles, ChevronDown, ChevronUp, Star } from 'lucide-react';
import type { ObservationEntry } from '@/types/fragment.types';

interface SeedHeaderProps {
  seed: string;
  title?: string | null;
  createdAt: string;
  sparks?: ObservationEntry[];
}

export const SeedHeader: React.FC<SeedHeaderProps> = ({
  seed,
  title,
  createdAt,
  sparks = [],
}) => {
  const [isSparksOpen, setIsSparksOpen] = useState(false);

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="sticky top-0 z-10 py-3 px-4 sm:px-5 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800/80 shadow-lg shadow-black/20 mb-4 transition-all">
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-400 font-medium text-[10px]">
          <Sprout className="w-3.5 h-3.5 shrink-0" />
          Seed &middot; The Anchor
        </span>
        <span className="text-[10px] text-zinc-500 font-mono shrink-0">
          {formattedDate}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-sm sm:text-base font-serif text-zinc-100 font-medium leading-snug tracking-tight">
          &ldquo;{seed}&rdquo;
        </h1>
        {title && (
          <span className="text-[11px] font-mono text-zinc-400 shrink-0 truncate max-w-[140px] sm:max-w-[200px]">
            {title}
          </span>
        )}
      </div>

      {/* Sparks attached directly beneath the seed */}
      {sparks.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-zinc-800/60">
          <button
            type="button"
            onClick={() => setIsSparksOpen(!isSparksOpen)}
            className="flex items-center justify-between text-xs text-amber-300/90 hover:text-amber-200 transition-colors cursor-pointer w-full group"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Active Sparks ({sparks.length})</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
              {isSparksOpen ? 'Hide' : 'View'}
              {isSparksOpen ? (
                <ChevronUp className="w-3 h-3 text-zinc-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              )}
            </span>
          </button>

          {isSparksOpen && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin animate-in fade-in slide-in-from-top-1">
              {sparks.map((spark) => (
                <div
                  key={spark.id}
                  className="py-1.5 px-3 rounded-xl bg-zinc-900/70 border-l-2 border-amber-400/90 text-xs font-serif italic text-zinc-200/90 leading-relaxed shadow-sm"
                >
                  <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-amber-400/80 mb-0.5 not-italic">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    Spark
                  </div>
                  &ldquo;{spark.content}&rdquo;
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
