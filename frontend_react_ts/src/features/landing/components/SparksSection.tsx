import React from 'react'
import { Sparkles, Star } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'

export const SparksSection: React.FC = () => {
  return (
    <section id="sparks" className="relative z-10 py-24 px-6 max-w-5xl mx-auto border-t border-zinc-800/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Badge variant="spark" className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Meaning Assignment
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-100 font-serif">
          Conversation is not a Spark. <br />
          <span className="text-amber-400 italic">You decide what matters.</span>
        </h2>
        <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
          In typical chat tools, everything scrolls away equally into an endless feed. In Forge,
          when an observation or reflection strikes a chord, you explicitly anchor it as a Spark.
        </p>
      </div>

      <div className="max-w-xl mx-auto p-6 rounded-2xl bg-zinc-900/80 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs text-zinc-500 pb-3 border-b border-zinc-800">
          <span className="font-mono text-zinc-400">Observation #03</span>
          <span className="text-amber-400 flex items-center gap-1 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> Spark Kept
          </span>
        </div>

        <p className="mt-4 text-sm sm:text-base text-zinc-200 leading-relaxed font-serif">
          &ldquo;There may be a connection between your desire to protect unfinished work and the fear that finishing it reveals its limits.&rdquo;
        </p>

        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <button className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/40 text-xs font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> ✦ Kept as Spark
          </button>
          <span className="text-xs text-zinc-500">Explicit &middot; Reversible &middot; Anchored</span>
        </div>
      </div>
    </section>
  )
}
