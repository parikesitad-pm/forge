import React from 'react'
import type { DocSection } from '../data/docsContent'

interface DocsSidebarProps {
  sections: DocSection[]
  activeSection: string
  onSelectSection: (id: string) => void
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({
  sections,
  activeSection,
  onSelectSection,
}) => {
  // Group sections by category
  const categories = Array.from(new Set(sections.map((s) => s.category)))

  return (
    <nav className="w-full space-y-6">
      {categories.map((cat) => (
        <div key={cat} className="space-y-1.5">
          <h5 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium px-2">
            {cat}
          </h5>
          <ul className="space-y-0.5">
            {sections
              .filter((s) => s.category === cat)
              .map((section) => {
                const isActive = activeSection === section.id
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => onSelectSection(section.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-pink-500/10 text-pink-400 font-medium'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      <span>{section.title}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                    </button>
                  </li>
                )
              })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
