import React, { useState, useRef, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

interface ThoughtComposerProps {
  onSend: (content: string) => Promise<void>
  isSubmitting?: boolean
  disabled?: boolean
  placeholder?: string
}

export const ThoughtComposer: React.FC<ThoughtComposerProps> = ({
  onSend,
  isSubmitting = false,
  disabled = false,
  placeholder = 'Continue the thought…',
}) => {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-expand textarea height as user types, up to max-h-40 (160px)
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = 160
    const scrollH = el.scrollHeight
    el.style.height = `${Math.min(scrollH, maxHeight)}px`
    el.style.overflowY = scrollH > maxHeight ? 'auto' : 'hidden'
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || isSubmitting || disabled) return

    await onSend(trimmed)
    setContent('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pt-2 pb-1 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-zinc-900/95 border border-zinc-700/80 p-2 shadow-2xl backdrop-blur-xl focus-within:border-pink-500/60 transition-colors"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 resize-none outline-none font-serif leading-relaxed min-h-[40px] max-h-40 scrollbar-thin"
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
          <span>Press Enter to send</span>
        </div>
      </form>

      {/* Micro-footer attached right below composer */}
      <div className="py-1 text-center select-none">
        <p className="text-[11px] font-mono text-zinc-500">
          Forge &middot; A Thinking Companion
        </p>
      </div>
    </div>
  )
}
