import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border text-zinc-100 placeholder-zinc-500 text-sm transition-all duration-200 outline-none focus:ring-1',
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

Input.displayName = 'Input'
