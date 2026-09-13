import React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl bg-zinc-900/60 border text-zinc-100 placeholder-zinc-500 text-sm transition-all duration-200 outline-none focus:ring-1 resize-none',
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-zinc-800 focus:border-pink-500/80 focus:ring-pink-500/20 hover:border-zinc-700',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-400 pl-1">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
