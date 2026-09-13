import React, { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

interface ThoughtComposerProps {
  onSend: (content: string) => Promise<void>
  isSubmitting?: boolean
  disabled?: boolean
}

export const ThoughtComposer: React.FC<ThoughtComposerProps> = ({
  onSend,
  isSubmitting = false,
  disabled = false,
}) => {
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || isSubmitting || disabled) return

    await onSend(trimmed)
    setContent('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="sticky bottom-4 z-20 w-full max-w-2xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-zinc-900/95 border border-zinc-700/80 p-2 shadow-2xl backdrop-blur-xl focus-within:border-pink-500/60 transition-colors"
      >
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Continue the thought…"
            className="flex-1 px-3 py-2 bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 resize-none outline-none font-serif leading-relaxed max-h-32 min-h-[40px]"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!content.trim() || isSubmitting || disabled}
            isLoading={isSubmitting}
            className="rounded-xl w-9 h-9 p-0 shrink-0 mb-0.5"
            aria-label="Add Thought"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between px-3 pt-1 text-[10px] font-mono text-zinc-500">
          <span>Shift+Enter for newline</span>
          <span>Forge thinking companion</span>
        </div>
      </form>
    </div>
  )
}
