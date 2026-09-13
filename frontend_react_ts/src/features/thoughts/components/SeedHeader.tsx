import React from 'react';
import { Sprout } from 'lucide-react';

interface SeedHeaderProps {
  seed: string;
  createdAt: string;
}

export const SeedHeader: React.FC<SeedHeaderProps> = ({ seed, createdAt }) => {
  return (
    <div className="py-6 px-6 sm:px-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 mb-8 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-3">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-400 font-medium">
          <Sprout className="w-4 h-4" />
          Seed &middot; The Anchor
        </span>
        <span>
          {new Date(createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <h1 className="text-xl sm:text-2xl font-serif text-zinc-100 font-normal leading-relaxed tracking-tight">
        &ldquo;{seed}&rdquo;
      </h1>

      <p className="mt-2 text-[11px] text-zinc-500 font-mono">
        This is what you are exploring. Thoughts below unfold from this seed.
      </p>
    </div>
  );
};
