import React from 'react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/atoms/BrandLogo'
import { Button } from '@/components/atoms/Button'

export const LandingNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/70 border-b border-zinc-800/50 transition-all">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <BrandLogo size="md" showSubBrand />

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">
            How it works
          </a>
          <a href="#owl" className="hover:text-zinc-100 transition-colors">
            Owl
          </a>
          <a href="#sparks" className="hover:text-zinc-100 transition-colors">
            Sparks
          </a>
          <a href="#philosophy" className="hover:text-zinc-100 transition-colors">
            Philosophy
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Start Thinking
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
