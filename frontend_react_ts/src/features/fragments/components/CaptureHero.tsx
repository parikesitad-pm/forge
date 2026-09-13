import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { useCreateFragment } from '../hooks/useFragments'
import { useToast } from '@/app/providers/ToastProvider'
import { Button } from '@/components/atoms/Button'

export const CaptureHero: React.FC = () => {
  const [content, setContent] = useState('')
  const { mutateAsync: createFragment, isPending } = useCreateFragment()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return

    try {
      const fragment = await createFragment({ content: trimmed })
      toast('Seed planted. Owl is observing.', 'success')
      setContent('')
      navigate(`/app/fragments/${fragment.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not capture thought'
      toast(msg, 'error')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCapture(e)
    }
  }

  return (
    <section className="py-12 max-w-2xl mx-auto text-center">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif text-zinc-100 font-medium tracking-tight">
          Capture what&rsquo;s on your mind.
        </h2>
        <p className="text-xs text-zinc-400 font-mono">
          A thought doesn&rsquo;t need to be complete to be worth capturing.
        </p>
      </div>

      <form
        onSubmit={handleCapture}
        className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 p-3 shadow-2xl focus-within:border-zinc-700 transition-colors"
      >
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="An unfinished sentence, a question you've been avoiding, or a pattern you noticed..."
          className="w-full px-3 py-2 bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 resize-none outline-none font-serif leading-relaxed"
          autoFocus
        />

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-500 px-2">
          <span className="text-[11px] font-mono">Press Enter to capture</span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!content.trim() || isPending}
            isLoading={isPending}
            className="rounded-full px-4 gap-1.5"
          >
            Capture <ArrowUp className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>
    </section>
  )
}
