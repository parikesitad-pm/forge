import React from 'react';
import { Sprout } from 'lucide-react';

interface SeedHeaderProps {
  seed: string;
  title?: string | null;
  createdAt: string;
}

export const SeedHeader: React.FC<SeedHeaderProps> = ({ seed, title, createdAt }) => {
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
    </div>
  );
};
