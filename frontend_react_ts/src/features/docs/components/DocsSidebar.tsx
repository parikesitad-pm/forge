import React, { useEffect, useRef } from 'react';
import type { DocSection } from '../data/docsContent';

interface DocsSidebarProps {
  sections: DocSection[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  readingProgress?: number;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({
  sections,
  activeSection,
  onSelectSection,
  readingProgress,
}) => {
  const sidebarNavRef = useRef<HTMLElement>(null);

  // Group sections by category
  const categories = Array.from(new Set(sections.map((s) => s.category)));

  // Auto-scroll active section button into view inside sidebar scroll container
  useEffect(() => {
    if (!sidebarNavRef.current) return;
    const activeBtn = sidebarNavRef.current.querySelector(
      `[data-section-id="${activeSection}"]`
    );
    if (activeBtn && typeof activeBtn.scrollIntoView === 'function') {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSection]);

  const activeSectionIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <nav ref={sidebarNavRef} className="w-full space-y-5">
      {/* Reading Progress Indicator */}
      {typeof readingProgress === 'number' && (
        <div className="px-2 pb-3 mb-2 border-b border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              <span>Reading Progress</span>
            </span>
            <span className="text-pink-400 font-semibold">{readingProgress}%</span>
          </div>
          <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
          <div className="mt-1.5 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span>
              Section {activeSectionIndex >= 0 ? activeSectionIndex + 1 : 1} of {sections.length}
            </span>
            <span className="text-zinc-400 truncate max-w-[110px]">
              {sections[activeSectionIndex]?.title || 'Overview'}
            </span>
          </div>
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat} className="space-y-1.5">
          <h5 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium px-2">
            {cat}
          </h5>
          <div className="border-l border-zinc-800/80 ml-2 pl-2 space-y-0.5">
            {sections
              .filter((s) => s.category === cat)
              .map((section) => {
                const isActive = activeSection === section.id;
                const sectionIdx = sections.findIndex((s) => s.id === section.id);
                const isPassed = activeSectionIndex > sectionIdx;

                return (
                  <div key={section.id}>
                    <button
                      data-section-id={section.id}
                      onClick={() => onSelectSection(section.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-pink-500/15 text-pink-300 font-semibold border-l-2 -ml-[9px] border-pink-400 pl-3'
                          : isPassed
                          ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      <span className="truncate">{section.title}</span>
                      {isActive ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)] shrink-0 ml-1.5" />
                      ) : isPassed ? (
                        <span className="text-[10px] text-zinc-600 font-mono shrink-0 ml-1.5">✓</span>
                      ) : null}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );
};
