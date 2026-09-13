import React from 'react'
import { Sparkles, Check, X } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'

export const OwlSection: React.FC = () => {
  return (
    <section id="owl" className="relative z-10 py-24 px-6 max-w-5xl mx-auto border-t border-zinc-800/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <Badge variant="owl">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI Behavior Principle
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-100 font-serif">
            Not an oracle. <br />
            <span className="italic text-pink-400">An observer.</span>
          </h2>
          <p className="text-base text-zinc-300 leading-relaxed">
            Owl is designed specifically for people who are tired of chatbots that pretend to have
            all the answers.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Instead of manufacturing certainty or prescribing life advice, Owl watches your thought
            evolution, questions unexamined assumptions, and asks what you may not have noticed yet.
          </p>
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300">
            &ldquo;Owl observes. The thinker decides.&rdquo;
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-zinc-950/60 border border-rose-900/30">
            <div className="flex items-center gap-2 text-xs font-medium text-rose-400 mb-2">
              <X className="w-4 h-4" />
              Generic AI / Chatbots
            </div>
            <p className="text-xs text-zinc-400 italic">
              &ldquo;The reason you struggle with this is procrastination. Here are 5 productivity steps you must follow to resolve your dilemma...&rdquo;
            </p>
          </div>

          <div className="p-5 rounded-xl bg-pink-950/20 border border-pink-500/40 shadow-lg shadow-pink-950/20">
            <div className="flex items-center gap-2 text-xs font-medium text-pink-400 mb-2">
              <Check className="w-4 h-4" />
              Owl in Forge
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed font-serif">
              &ldquo;You seem to return to the tension between preserving your freedom and taking responsibility for a single outcome. What changes if choosing doesn&rsquo;t mean losing the other possibilities?&rdquo;
            </p>
            <div className="mt-3 text-[11px] text-zinc-500">
              Observational &middot; Non-prescriptive &middot; Thought-provoking
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
