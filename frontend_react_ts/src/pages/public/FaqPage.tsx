import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HelpCircle,
  ChevronDown,
  Search,
} from 'lucide-react'
import { BrandLogo } from '@/components/atoms/BrandLogo'
import { NeuralCanvas } from '@/features/landing/components/NeuralCanvas'

interface FaqItem {
  id: string
  question: string
  answer: string | React.ReactNode
  category: 'Concepts' | 'Owl & Privacy' | 'Archive & Sharing' | 'Technical & Deploy'
}

const FAQ_ITEMS: FaqItem[] = [
  // Concepts
  {
    id: 'what-is-a-fragment',
    category: 'Concepts',
    question: 'What is a Fragment?',
    answer:
      'A Fragment is a self-contained, evolving exploration of an unfinished thought. It lets you capture ideas in their raw, embryonic state without forcing them to be complete.',
  },
  {
    id: 'what-is-a-seed',
    category: 'Concepts',
    question: 'What is a Seed?',
    answer:
      'The Seed is the original sentence, question, or note that anchors a Fragment. While you can rename the Fragment display title, the foundational Seed remains immutable as the origin of the thought.',
  },
  {
    id: 'what-is-a-spark',
    category: 'Concepts',
    question: 'What is a Spark?',
    answer:
      'A Spark (✦) is an insight or memorable line you explicitly choose to pin from the timeline. Unlike normal notes, Sparks remain visible across the workspace as crystallizations of thought.',
  },
  {
    id: 'what-is-growth',
    category: 'Concepts',
    question: 'What is Growth?',
    answer:
      'Growth is our upcoming cross-fragment relational synthesis engine. Currently marked for a future Explore sprint, it will map emerging creative tensions across independent thoughts.',
  },
  {
    id: 'can-forge-help-lyrics-coding',
    category: 'Concepts',
    question: 'Can Forge help with lyrics, writing, coding, and business ideas?',
    answer:
      'Yes, absolutely. Forge is intentionally open-minded. If you write song lyrics, guitar chords, poetry, code architecture, or business strategies, Owl meets you in your creative domain rather than forcing psychological self-reflection.',
  },

  // Owl & Privacy
  {
    id: 'what-does-owl-do',
    category: 'Owl & Privacy',
    question: 'What does Owl do? Is it a chatbot?',
    answer:
      'No. Owl is an observant thinking companion, not a conversational chatbot or decision-maker. Owl notices patterns, challenges assumptions, and asks clarifying questions, but never tells you what to decide. Owl observes; the thinker decides.',
  },
  {
    id: 'is-thought-treated-as-truth',
    category: 'Owl & Privacy',
    question: 'Is my thought automatically treated as truth?',
    answer:
      'Never. In Forge, observations and inferences are treated as possibilities, not objective facts. Your embryonic thoughts are safe to be contradictory, exploratory, or incomplete.',
  },
  {
    id: 'how-does-personalization-affect-owl',
    category: 'Owl & Privacy',
    question: 'How does personalization affect Owl?',
    answer:
      'Your preferred name, interests, and bio are shared with Owl as quiet contextual nuance—never as rigid assumptions or conclusions. For instance, knowing you like music allows Owl to offer musical metaphors without assuming you are a musician.',
  },
  {
    id: 'is-birthday-used-as-conclusion',
    category: 'Owl & Privacy',
    question: 'Is my birthday / profile information used as a conclusion about me?',
    answer:
      'No. Date of birth is purely used to acknowledge your annual Birthday Reflection and calculate your age. It is never analyzed for astrological assumptions or behavioral conclusions.',
  },
  {
    id: 'what-does-owl-remember',
    category: 'Owl & Privacy',
    question: 'What does Owl remember? Does it automatically remember its own observations?',
    answer:
      'Owl only remembers what you explicitly grant it permission to remember via the Memory tab or explicit confirmation. Owl never silently turns its own AI observations into factual memories.',
  },
  {
    id: 'can-i-edit-or-delete-owl-memory',
    category: 'Owl & Privacy',
    question: 'Can I edit or delete Owl\'s memory?',
    answer:
      'Yes. In Settings → Memory, you have complete transparent control. You can view every stored topic, edit descriptions, forget individual memories, or turn off memory entirely with a single toggle.',
  },
  {
    id: 'what-are-owl-instructions',
    category: 'Owl & Privacy',
    question: 'What are Owl Instructions? Can they override Owl\'s core rules?',
    answer:
      'Owl Instructions let you customize how Owl engages with your thoughts (e.g. "ask more questions", "focus on poetic meter"). However, custom instructions CANNOT override Core Rules: even if requested, Owl will never make life decisions for you.',
  },

  // Archive & Sharing
  {
    id: 'what-happens-when-archive',
    category: 'Archive & Sharing',
    question: 'What happens when I archive a thought?',
    answer:
      'Archiving removes the Fragment from your active thinking space, recent lists, and search results. It is stored safely in Archived Fragments and is never permanently deleted unless you explicitly choose to delete it.',
  },
  {
    id: 'can-i-restore-archived-fragment',
    category: 'Archive & Sharing',
    question: 'Can I restore an archived Fragment?',
    answer:
      'Yes. In the sidebar Archive view, click the Restore icon on any archived thought to return it immediately to your active workspace with its entire thought history intact.',
  },
  {
    id: 'why-cant-i-move-fragment',
    category: 'Archive & Sharing',
    question: 'Why can\'t I move a Fragment into another Fragment?',
    answer:
      'Fragments are sovereign, independent thoughts, not files in nested folders. Future sprints will introduce relational connections ("Related Thoughts") that link thoughts without physical relocation.',
  },
  {
    id: 'what-does-public-sharing-expose',
    category: 'Archive & Sharing',
    question: 'What does public sharing expose?',
    answer:
      'Public sharing provides a read-only view of ONLY that single Fragment, its seed, timeline entries, and kept sparks. It generates a secure URL with an opaque random token suffix. Public visitors cannot access your account, other fragments, or settings.',
  },
  {
    id: 'can-someone-edit-shared-fragment',
    category: 'Archive & Sharing',
    question: 'Can someone edit a shared Fragment?',
    answer:
      'No. Shared links are strictly read-only reading surfaces without a composer or editing tools.',
  },
  {
    id: 'can-i-revoke-shared-link',
    category: 'Archive & Sharing',
    question: 'Can I revoke a shared link?',
    answer:
      'Yes. Open the Share dialog on that fragment at any time and click Revoke Link. The link immediately stops working for all public visitors.',
  },

  // Technical & Deploy
  {
    id: 'why-hosted-preview-coming-soon',
    category: 'Technical & Deploy',
    question: 'Why does the hosted preview say "Coming soon" for Login/Register?',
    answer:
      'Cloud backend deployment on Railway is temporarily in "Coming soon" mode due to an expired token and paused database instance. To explore the full application with live authentication and Owl companion, clone the repository and run Rails locally at http://localhost:3000.',
  },
  {
    id: 'why-is-swagger-unavailable-preview',
    category: 'Technical & Deploy',
    question: 'Why is Swagger / API Reference unavailable on the hosted preview?',
    answer:
      'On the hosted preview, the Rails backend deployment on Railway is temporarily paused / Coming Soon due to an expired token. Swagger requires a running Rails backend to serve live OpenAPI endpoints.',
  },
  {
    id: 'how-to-run-swagger-locally',
    category: 'Technical & Deploy',
    question: 'How do I run Swagger locally?',
    answer:
      'Start the Rails backend with `bin/rails server -p 3000` inside `backend_rails/`, then open http://localhost:3000/api/docs to explore the full interactive OpenAPI 3.0 specification.',
  },
  {
    id: 'how-to-run-tests',
    category: 'Technical & Deploy',
    question: 'How do I run frontend and backend tests?',
    answer:
      'Frontend: Run `npm test -- --run` in `frontend_react_ts/`. Backend: Run `bin/rails test` in `backend_rails/`.',
  },
  {
    id: 'how-to-deploy-vercel',
    category: 'Technical & Deploy',
    question: 'How do I deploy frontend to Vercel?',
    answer:
      'Connect `frontend_react_ts/` as root directory in Vercel with Vite preset. Environment variable: `VITE_API_BASE_URL`. Rewrites are handled automatically via `vercel.json`.',
  },
  {
    id: 'how-to-deploy-railway',
    category: 'Technical & Deploy',
    question: 'How do I deploy backend to Railway?',
    answer:
      'The Rails backend includes a production Dockerfile and `railway.json`. Once an active Railway plan/token is configured, push the repository and attach a managed PostgreSQL database with `DATABASE_URL`.',
  },
  {
    id: 'environment-variables-needed',
    category: 'Technical & Deploy',
    question: 'What environment variables are needed?',
    answer:
      'Frontend: `VITE_API_BASE_URL`. Backend: `DATABASE_URL`, `SECRET_KEY_BASE`, `GOOGLE_API_KEY` (for Owl Gemini 3.6 Flash), and `FRONTEND_URL` (for CORS cookies).',
  },
  {
    id: 'what-happens-to-uploaded-files',
    category: 'Technical & Deploy',
    question: 'What happens to uploaded files (like avatars)?',
    answer:
      'Profile avatars are stored via Rails Active Storage (local disk in development, Cloud S3/R2 compatible in production). You can replace or permanently purge your avatar at any time in Settings.',
  },
  {
    id: 'how-themes-work',
    category: 'Technical & Deploy',
    question: 'How do Light, Dark, and System themes work?',
    answer:
      'Forge defaults to a dark-first theme to eliminate visual flashbang on load. System mode matches your OS `prefers-color-scheme` automatically. Preferences are saved in persistent storage.',
  },
]

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [openItems, setOpenItems] = useState<string[]>(['what-is-a-fragment', 'what-does-owl-do'])

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const categories = ['All', 'Concepts', 'Owl & Privacy', 'Archive & Sharing', 'Technical & Deploy']

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === 'string' &&
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-pink-500/30">
      <NeuralCanvas className="opacity-20 fixed inset-0 pointer-events-none z-0" />

      {/* Top Header */}
      <header className="relative z-10 sticky top-0 h-14 px-4 sm:px-8 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandLogo size="sm" showSubBrand={false} asLink={false} />
          <span className="font-serif font-medium text-sm text-zinc-200">Forge</span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <Link to="/docs" className="hover:text-zinc-200 transition-colors">
            Documentation
          </Link>
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Title Area */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-500/30 text-xs text-pink-300 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-zinc-100 font-normal tracking-tight">
            How Forge Works
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed font-sans">
            Principles, privacy guarantees, archival mechanics, and technical guides for thinkers.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-100 text-zinc-950 font-medium shadow'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 pt-2">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-zinc-500 rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
              No matching questions found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = openItems.includes(item.id)
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden transition-colors hover:border-zinc-700/80"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-serif font-medium text-zinc-200">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-pink-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed font-sans border-t border-zinc-850/60">
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 text-center border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <p className="text-xs font-mono text-zinc-500">
          Forge &mdash; A Thinking Companion &middot;{' '}
          <Link
            to="/"
            className="text-pink-400 hover:text-pink-300 transition-colors font-medium underline underline-offset-4"
          >
            Home
          </Link>{' '}
          &middot;{' '}
          <Link
            to="/docs"
            className="text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-4"
          >
            Documentation
          </Link>
        </p>
      </footer>
    </div>
  )
}
