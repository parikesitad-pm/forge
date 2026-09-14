import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Sprout, Sparkles, ArrowLeft, Globe } from 'lucide-react'
import { BrandLogo } from '@/components/atoms/BrandLogo'
import { NeuralCanvas } from '@/features/landing/components/NeuralCanvas'
import { Spinner } from '@/components/atoms/Spinner'
import { fragmentsApi } from '@/services/api/fragmentsApi'
import type { SharedFragmentDetail } from '@/types/fragment.types'

export const SharedFragmentPage: React.FC = () => {
  const { username, shareSlug } = useParams<{ username: string; shareSlug: string }>()
  const [data, setData] = useState<SharedFragmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username || !shareSlug) {
      setError('Invalid link')
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    fragmentsApi
      .getShared(username, shareSlug)
      .then((res) => {
        if (isMounted) setData(res)
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : 'This shared fragment is private or has been revoked.'
          setError(msg)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [username, shareSlug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <span className="text-xs font-mono text-zinc-500">Opening shared thought...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <NeuralCanvas className="opacity-20 fixed inset-0 pointer-events-none" />
        <div className="relative z-10 max-w-md space-y-4 p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-2xl backdrop-blur-md">
          <BrandLogo size="md" showSubBrand className="mx-auto mb-2" />
          <h1 className="text-lg font-serif text-zinc-200">Shared Fragment Unavailable</h1>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            {error || 'This link may have expired, been revoked, or made private by its author.'}
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Forge
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const authorName = data.author?.calling_name || data.author?.username || 'Thinker'
  const authorUsername = data.author?.username || 'thinker'

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-pink-500/30">
      <NeuralCanvas className="opacity-25 fixed inset-0 pointer-events-none z-0" />

      {/* Top Header */}
      <header className="relative z-10 sticky top-0 h-14 px-4 sm:px-8 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandLogo size="sm" showSubBrand={false} asLink={false} />
          <span className="font-serif font-medium text-sm text-zinc-200">Forge</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Shared by</span>
          <span className="text-zinc-200 font-medium">@{authorUsername}</span>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Sticky Seed Anchor */}
        <div className="sticky top-16 z-20 py-3.5 px-5 sm:px-6 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800/90 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-400 font-medium text-[10px]">
              <Sprout className="w-3.5 h-3.5" />
              Seed &middot; The Anchor
            </span>
            <span className="text-[10px] text-zinc-500">
              {new Date(data.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-sm sm:text-base font-serif text-zinc-100 font-medium leading-relaxed">
            &ldquo;{data.seed}&rdquo;
          </h1>

          {data.title && (
            <p className="mt-1 text-[11px] font-mono text-zinc-400">
              {data.title}
            </p>
          )}
        </div>

        {/* Kept Sparks (if any) */}
        {data.sparks && data.sparks.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kept Sparks</span>
            </div>
            <div className="space-y-1.5">
              {data.sparks.map((s) => (
                <p key={s.id} className="text-xs text-amber-200/90 font-serif italic">
                  ✦ &ldquo;{s.content}&rdquo;
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Thought Evolution Timeline */}
        <div className="space-y-3 pb-8">
          <div className="px-1 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Thought Evolution
          </div>

          {data.entries.map((entry) => {
            const isUser = entry.role === 'user'
            const timeString = new Date(entry.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={entry.id}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all ${
                  entry.pinned
                    ? 'bg-amber-950/15 border border-amber-500/20'
                    : isUser
                      ? 'bg-zinc-900/50 border border-zinc-850'
                      : 'bg-zinc-950/70 border border-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  {isUser ? (
                    <span className="text-zinc-300 font-medium">{authorName}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-pink-400 font-medium">
                      <Sparkles className="w-3 h-3" />
                      Owl
                    </span>
                  )}
                  <span className="text-zinc-500 text-[10px]">{timeString}</span>
                </div>

                <p
                  className={`text-[13px] sm:text-[14px] text-zinc-200 font-serif leading-relaxed whitespace-pre-wrap ${
                    !isUser ? 'italic text-zinc-300' : ''
                  }`}
                >
                  {!isUser ? `\u201C${entry.content}\u201D` : entry.content}
                </p>
              </div>
            )
          })}
        </div>
      </main>

      {/* Minimal One-Line Footer per spec */}
      <footer className="relative z-10 py-5 px-4 text-center border-t border-zinc-900 bg-zinc-950/90 backdrop-blur-md">
        <p className="text-xs font-mono text-zinc-500">
          Forge &mdash; A Thinking Companion &middot;{' '}
          <Link
            to="/"
            className="text-pink-400 hover:text-pink-300 transition-colors font-medium underline underline-offset-4"
          >
            Become a thinker
          </Link>
        </p>
      </footer>
    </div>
  )
}
