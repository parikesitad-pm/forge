import React from 'react'
import { Sprout, Eye, Sparkles, Compass, Feather } from 'lucide-react'

export const EvolutionSection: React.FC = () => {
  const stages = [
    {
      icon: Feather,
      title: 'Fragment',
      tagline: 'Raw capture before it vanishes',
      desc: 'No title, category, or project required. Capture should have near-zero friction.',
      badge: 'Capture First',
    },
    {
      icon: Sprout,
      title: 'Seed',
      tagline: 'The anchor of thinking',
      desc: 'The initial thought anchors the workspace. It communicates: "This is what I am trying to understand."',
      badge: 'Anchor',
    },
    {
      icon: Eye,
      title: 'Observation',
      tagline: 'Owl observes patterns',
      desc: 'Not an oracle. Owl questions assumptions, connects ideas, and poses curious questions without prescribing truth.',
      badge: 'Perspective',
    },
    {
      icon: Sparkles,
      title: 'Spark',
      tagline: 'The thinker assigns meaning',
      desc: 'An observation only becomes a Spark when you explicitly decide: "This matters." Never automated.',
      badge: 'You Decide',
    },
    {
      icon: Compass,
      title: 'Growth',
      tagline: 'Tentative relationships emerge',
      desc: 'Reflects on Seed + Sparks. Surfaces recurring tensions and creative connections while always preserving uncertainty.',
      badge: 'Synthesis',
    },
  ]

  return (
    <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs uppercase tracking-widest text-pink-500 font-mono mb-2">
          The Mental Model
        </p>
        <h2 className="text-3xl font-medium text-zinc-100 font-serif">
          How thinking unfolds in Forge
        </h2>
        <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
          This is not a rigid linear funnel. It describes how an unformed intuition gathers
          clarity through quiet reflection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon
          return (
            <div
              key={stage.title}
              className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-800/70 flex items-center justify-center text-zinc-300 group-hover:text-pink-400 transition-colors mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Stage 0{idx + 1}
                </span>
                <h3 className="text-lg font-medium text-zinc-100 mt-1">{stage.title}</h3>
                <p className="text-xs font-medium text-pink-400/90 mt-1">{stage.tagline}</p>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{stage.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                <span>{stage.badge}</span>
                <span className="text-zinc-600 font-mono">&rarr;</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
