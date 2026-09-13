import React from 'react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/atoms/BrandLogo'

export const LandingFooter: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-zinc-800/80 pt-16 pb-12 px-6 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-800/60">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <BrandLogo size="md" showSubBrand />
            <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-3">
              A quiet creative journal for capturing unfinished thoughts, exploring them with Owl,
              and noticing what may be starting to take shape.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-zinc-300 font-mono font-medium">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-zinc-100 transition-colors">
                  Philosophy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-zinc-300 font-mono font-medium">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link to="/docs" className="hover:text-zinc-100 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href="/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-100 transition-colors"
                >
                  API Reference ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Project */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-zinc-300 font-mono font-medium">
              Project
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <a
                  href="https://github.com/parikesitad-pm/forge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-100 transition-colors"
                >
                  GitHub ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>Forge &middot; A Thinking Companion</p>
          <p className="text-[11px] text-zinc-400 text-center sm:text-right">
            crafted with &lt;3 by parikesitad-pm &copy; 2026 MODULA Project &middot; MIT License
          </p>
        </div>
      </div>
    </footer>
  )
}
