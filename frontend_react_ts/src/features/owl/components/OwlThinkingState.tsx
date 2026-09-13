import React from 'react'
import { Sparkles } from 'lucide-react'

export const OwlThinkingState: React.FC = () => {
  return (
    <div className="py-4 px-5 rounded-xl bg-pink-950/15 border border-pink-500/20 flex items-center gap-3 text-xs text-pink-300 animate-pulse my-4">
      <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
      <span className="font-serif italic">
        ✦ Owl is looking at this thought…
      </span>
    </div>
  )
}
