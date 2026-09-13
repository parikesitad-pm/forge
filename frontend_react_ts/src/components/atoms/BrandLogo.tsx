import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showSubBrand?: boolean
  className?: string
  asLink?: boolean
  href?: string
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubBrand = true,
  className,
  asLink = true,
  href = '/',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  }

  const titleClasses = {
    sm: 'text-base font-semibold tracking-tight',
    md: 'text-lg font-semibold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
  }

  const subBrandClasses = {
    sm: 'text-[9px] text-zinc-400 font-normal tracking-wide',
    md: 'text-[10px] text-zinc-400 font-normal tracking-wide',
    lg: 'text-xs text-zinc-400 font-normal tracking-wide',
  }

  const content = (
    <div className={cn('inline-flex items-center gap-3 select-none group', className)}>
      <img
        src="/forge_logo.png"
        alt="Forge Logo"
        className={cn(sizeClasses[size], 'object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300')}
      />
      <div className="flex flex-col text-left">
        <span className={cn(titleClasses[size], 'text-zinc-100 font-serif leading-none')}>
          Forge
        </span>
        {showSubBrand && (
          <span className={cn(subBrandClasses[size], 'mt-1 leading-none text-zinc-400')}>
            by Modula Project
          </span>
        )}
      </div>
    </div>
  )

  if (asLink) {
    return (
      <Link to={href} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
