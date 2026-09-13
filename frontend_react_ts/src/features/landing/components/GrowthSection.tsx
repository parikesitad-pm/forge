import React from 'react'
import { Compass, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'

export const GrowthSection: React.FC = () => {
  return (
    <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto border-t border-zinc-800/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Badge variant="default" className="mb-4 text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
          <Compass className="w-3.5 h-3.5 mr-1" />
          Emerging Synthesis
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-100 font-serif">
          Not a summary. <br />
          <span className="italic text-emerald-400">Knowledge taking shape.</span>
        </h2>
        <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
          Chatbots treat thoughts as disposable conversations to be summarized into bullet points.
          Forge tracks how your Sparks connect across time, surfacing creative tension and emergent patterns.
        </p>
      </div>

      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-2xl relative">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Something may be taking shape
        </div>

        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-serif">
          <p>
            You repeatedly connect unfinished projects with difficulty deciding where your attention should go.
          </p>
          <p>
            At the same time, you describe keeping several options open as creatively energizing.
          </p>
          <p className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-zinc-200 italic">
            There may be a tension between possibility and commitment.
          </p>
          <p className="text-xs text-zinc-400 font-sans">
            Does this connection feel meaningful to you?
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Grounded in 3 Sparks
          </span>
          <span>Preserving uncertainty</span>
        </div>
      </div>
    </section>
  )
}
