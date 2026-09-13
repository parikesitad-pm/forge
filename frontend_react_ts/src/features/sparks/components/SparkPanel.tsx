import React, { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp, Star } from 'lucide-react'
import type { ObservationEntry } from '@/types/fragment.types'

interface SparkPanelProps {
  sparks: ObservationEntry[]
}

export const SparkPanel: React.FC<SparkPanelProps> = ({ sparks }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (sparks.length === 0) return null

  return (
    <div className="rounded-2xl bg-zinc-900/40 border border-amber-500/20 mb-6 overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Sparks kept ({sparks.length})</span>
        </div>
        <div className="text-zinc-500 hover:text-zinc-300">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-zinc-800/80 space-y-4 bg-zinc-950/40">
          {sparks.map((spark) => (
            <div key={spark.id} className="border-l-2 border-amber-400/80 pl-4 py-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/80 uppercase tracking-wider mb-1">
                <Star className="w-3 h-3 fill-amber-400" />
                Spark
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-serif leading-relaxed italic">
                &ldquo;{spark.content}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
