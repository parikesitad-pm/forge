import React from 'react';

export const FragmentListSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => {
  return (
    <div
      className="w-full space-y-3 animate-pulse"
      data-testid="fragment-skeleton"
    >
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
        <div className="h-3 w-28 bg-zinc-800/60 rounded" />
        <div className="h-3 w-16 bg-zinc-800/60 rounded" />
      </div>

      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-3"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800/80 rounded w-5/6" />
            <div className="h-4 bg-zinc-800/40 rounded w-1/2" />
          </div>
          <div className="flex items-center gap-4 pt-1">
            <div className="h-3 w-16 bg-zinc-800/60 rounded-full" />
            <div className="h-3 w-14 bg-zinc-800/60 rounded-full" />
            <div className="h-3 w-12 bg-zinc-800/60 rounded-full ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ThoughtDetailSkeleton: React.FC = () => {
  return (
    <div
      className="w-full space-y-6 animate-pulse"
      data-testid="thought-detail-skeleton"
    >
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
        <div className="h-3 w-20 bg-pink-500/30 rounded" />
        <div className="h-6 bg-zinc-800 rounded w-3/4" />
        <div className="h-4 bg-zinc-800/50 rounded w-1/3" />
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2 max-w-lg">
          <div className="h-3.5 bg-zinc-800/80 rounded w-full" />
          <div className="h-3.5 bg-zinc-800/60 rounded w-4/5" />
        </div>
        <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-900/30 space-y-2 max-w-lg ml-auto">
          <div className="h-3 w-16 bg-pink-500/40 rounded" />
          <div className="h-3.5 bg-pink-900/40 rounded w-full" />
          <div className="h-3.5 bg-pink-900/30 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
};
