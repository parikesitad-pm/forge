import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'spark' | 'seed' | 'owl'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50',
    spark: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    seed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    owl: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-wide select-none',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
