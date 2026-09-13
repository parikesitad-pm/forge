import React from 'react'
import { BrandLogo } from '@/components/atoms/BrandLogo'

export const LandingFooter: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-zinc-800/80 py-12 px-6 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <BrandLogo size="sm" showSubBrand />

        <div className="text-xs text-zinc-500 text-center sm:text-right font-mono">
          <p>Forge &middot; A Thinking Companion</p>
          <p className="mt-1 text-[11px] text-zinc-600">
            Copyright &copy; 2026 parikesitad-pm &middot; MIT License
          </p>
        </div>
      </div>
    </footer>
  )
}
