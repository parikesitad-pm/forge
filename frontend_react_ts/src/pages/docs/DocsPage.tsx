import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/components/atoms/BrandLogo';
import { Button } from '@/components/atoms/Button';
import { useAuth } from '@/app/providers/AuthProvider';
import { docsSections } from '@/features/docs/data/docsContent';
import { DocsSidebar } from '@/features/docs/components/DocsSidebar';

export const DocsPage: React.FC = () => {
  const { authStatus } = useAuth();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle hash scrolling on mount or hash change
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && docsSections.some((s) => s.id === hash)) {
      setActiveSection(hash);
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // Robust ScrollSpy and animated header scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Find current reading section
      let currentId = docsSections[0]?.id || 'overview';
      for (const section of docsSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            currentId = section.id;
          }
        }
      }
      setActiveSection(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.location.hash = id;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeDoc =
    docsSections.find((s) => s.id === activeSection) || docsSections[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Animated Shrinking Static / Fixed Header with Breadcrumb */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-300 ease-out ${
          isScrolled
            ? 'h-12 bg-zinc-950/95 shadow-lg shadow-black/40'
            : 'h-16 bg-zinc-950/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Breadcrumb: [logo] docs / [yang lagi dibaca] */}
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo size="sm" showSubBrand={false} href="/" />
            <span className="text-zinc-600">/</span>
            <Link
              to="/docs"
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
            >
              docs
            </Link>
            {activeDoc && (
              <>
                <span className="text-zinc-600">/</span>
                <span className="text-xs font-mono text-pink-400 font-medium truncate max-w-[140px] sm:max-w-xs transition-all">
                  {activeDoc.title}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors hidden md:flex items-center gap-1 font-mono"
            >
              <span>Swagger API</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <div className="h-4 w-px bg-zinc-800 hidden md:block" />

            {authStatus === 'authenticated' ? (
              <Link to="/app/continue">
                <Button variant="primary" size="sm">
                  Continue thinking
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Start Thinking
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/60 transition-colors"
              aria-label="Toggle docs navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-6 py-6 space-y-4">
          <DocsSidebar
            sections={docsSections}
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />
        </div>
      )}

      {/* Documentation Layout with Pinned Static Desktop Sidebar */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 flex gap-12">
        {/* Static Desktop Sidebar (pinned to top, does not scroll away with page) */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-16 self-start h-[calc(100vh-5rem)] overflow-y-auto pr-4 scrollbar-thin">
          <DocsSidebar
            sections={docsSections}
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-3xl min-w-0 pb-24 space-y-16">
          {docsSections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-24 pt-4 border-b border-zinc-900 pb-16 last:border-0"
            >
              {section.content}
            </article>
          ))}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-xs text-zinc-500 font-mono">
        <p>Forge Documentation &middot; A Thinking Companion</p>
        <p className="mt-1 text-[11px] text-zinc-400">
          crafted with &lt;3 by parikesitad-pm &copy; 2026 MODULA Project
          &middot; MIT License
        </p>
      </footer>
    </div>
  );
};
