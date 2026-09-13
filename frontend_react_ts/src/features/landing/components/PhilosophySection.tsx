import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { useAuth } from '@/app/providers/AuthProvider'

export const PhilosophySection: React.FC = () => {
  const { authStatus } = useAuth()

  const pillars = [
    {
      title: 'A thought doesn’t need to be complete to be worth capturing.',
      body: 'Premature structuring kills raw creativity. In Forge, fragments can exist as half-sentences, questions, or raw intuitions without guilt.',
    },
    {
      title: 'Capture first. Understand later.',
      body: 'Frictionless capture allows you to deposit ideas into the soil before your inner critic demands a folder, a tag, or a deadline.',
    },
    {
      title: 'Forge doesn’t think for you. It helps you think.',
      body: 'AI should not substitute human inquiry. The thinker remains the author, interpreter, and final decider of what everything means.',
    },
  ]

  return (
    <section id="philosophy" className="relative z-10 py-24 px-6 max-w-5xl mx-auto border-t border-zinc-800/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs uppercase tracking-widest text-pink-500 font-mono mb-2">
          Product Philosophy
        </p>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-100 font-serif">
          Principles of thoughtful software
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {pillars.map((p, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-zinc-500">Pillar 0{i + 1}</span>
              <h3 className="text-base font-medium text-zinc-100 mt-2 font-serif leading-snug">
                &ldquo;{p.title}&rdquo;
              </h3>
              <p className="mt-3 text-xs text-zinc-400 leading-relaxed">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Closing CTA */}
      <div className="text-center max-w-2xl mx-auto py-12 px-6 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-2xl">
        <h3 className="text-2xl sm:text-3xl font-medium text-zinc-100 font-serif">
          What have you been meaning to think about?
        </h3>
        <p className="mt-3 text-sm text-zinc-400">
          Plant your seed today. No pressure to make sense right away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 min-h-[44px]">
          {authStatus === 'unknown' ? (
            <div
              data-testid="auth-skeleton-philosophy"
              className="h-11 w-52 rounded-xl bg-zinc-900/80 border border-zinc-800 animate-pulse"
            />
          ) : authStatus === 'authenticated' ? (
            <Link to="/app/continue">
              <Button variant="primary" size="lg" className="px-8 shadow-lg shadow-pink-600/25">
                Continue thinking <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button variant="primary" size="lg" className="px-8 shadow-lg shadow-pink-600/25">
                  Capture your first thought <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="lg">
                  Log In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
