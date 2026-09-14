# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Public Fragment Sharing**: Public read-only fragment view at `/share/@:username/:share_slug` with opaque 8-character random token suffix (`generate_share_link!` and `revoke_share_link!`), sticky seed anchor, kept sparks, and ambient branding.
- **Settings Modal Rebuild**: ChatGPT/Claude-style responsive dialog with tabs (Account with avatar upload and Date of Birth picker/derived age; Personalization with preferred calling name and creative interests; Transparent Memory manager; Owl Instructions; Security with password updates and permanent "DELETE" account confirmation dialog).
- **Transparent Memory Manager**: Opt-in user memory system (`user_memories` table, CRUD endpoints, and `use_memory` toggle) storing explicit thinker memories without silent AI inference.
- **Forge Reflections Engine (`ForgeMomentOverlay`)**: Celebrates user journey milestones (3mo seed pulse, 6mo fragments gather + owl, 9mo fade to spark, 1yr dim + banner + soft confetti, 18mo bridging, 2yr constellation) and separate Birthday moment, with Birthday priority scheduling, typing guards, reduced-motion support, and server-side milestone persistence.
- **Dedicated FAQ Page (`/faq`)**: Comprehensive answers across 30+ questions explaining Seeds, Sparks, Growth, Owl nature, open-minded creative thought handling, public sharing, memory privacy, local Swagger, and deployment status.
- **Display Title Separation**: Distinct `title` attribute for Fragment display names, ensuring Seed (`content`) remains immutable when renaming.
- **Swagger Fallback Modal**: Accessible guide in `/docs` directing thinkers to the local Rails OpenAPI endpoint (`http://localhost:3000/api/docs`) and `/faq#api-docs` when running on cloud preview.

### Changed
- **Gemini Adapter Upgrade**: Upgraded Owl adapter from unavailable `gemini-2.5-flash` to `gemini-3.6-flash` with 2048 token allowance for thinking/reasoning outputs.
- **Open-Minded Owl Prompting**: Empowered Owl to understand lyrics, songs, stories, code architectures, technical thoughts, and business plans without forcing psychological self-reflection.
- **Fragment Workspace Refinements**: Made SeedHeader compact and sticky at top of workspace; reduced timeline font sizes for greater density; moved "All thoughts" icon immediately before the `•••` action menu.
- **Database Archive Isolation**: Archived fragments are stored via database `archived_at` timestamps and strictly excluded from all normal queries, sidebars, search, and counts, accessible only in the Archive view with Restore and permanent Delete actions.
- **Docs Page Scrolling & Sticky Fix**: Removed parent `overflow-x: clip` blocking CSS `position: sticky` on header and sidebar; added `history.scrollRestoration = 'manual'` and instant scroll reset to `(0, 0)` unless a valid hash is provided.
- **Deployment-Aware Landing CTAs**: Landing page action buttons display `Coming Soon` on hosted preview when cloud backend is paused, without affecting local development.

### Removed
- **"Move to" Fragment Flow**: Completely removed `MoveToFragmentModal` and all Move actions across the workspace and API.

### Changed

- Paused Railway backend deployment due to expired token, marking cloud backend as Coming Soon / Disabled across documentation, READMEs, auth pages, and client error diagnostics.
- Removed redundant username and profile picture from top workspace header, consolidating account controls in the sidebar thinker popover.
- Hardened `useReducedMotion` hook against headless test environments without `window.matchMedia`.
- Fixed fragment archive and move actions on `/app/fragments/:id` to persist in storage and invalidate query caches.
- Resolved login and register navigation race conditions via synchronous `sessionUser` state in `AuthProvider`.
- Replaced generic "Thinker" and "Observer" labels with user's custom nickname and clean "Owl" branding.
- Temporarily disabled "Observation" and "Growth" sidebar navigation items with a "Soon" badge.
- Re-architected `/app` workspace into ChatGPT-style layout with scrollable thought stream and bottom-fixed auto-expanding composer.
- Attached compact micro-footer (`Forge · A Thinking Companion`) right below the chat composer.
- Widened `/app/settings` container to `max-w-4xl` for spacious profile management.
- Fixed landing footer and Swagger HTML typo `&nearr;` with clean unicode `↗`.
- Fixed `/app` logout bug and unauthorized toasts by gating TanStack Query calls and invalidating session cookies.
- Fixed `/docs` sticky header and sidebar by switching from `overflow-x: hidden` to `overflow-x: clip`, adding linear reading progress bar, auto-scrolling active items, and bottom boundary detection.

### Removed

- Removed all Docs navigation links from inside the authenticated `/app` workspace.

- Session-aware landing page navigation and hero CTAs with subtle skeleton hydration to eliminate visual flicker.
- Direct "Continue thinking" routing via `/app/continue` destination resolver without leaking private fragment data into public markup.
- Comprehensive `/docs` documentation site with desktop sidebar, mobile drawer, copyable code blocks, and deployment guides (Vercel, Railway, PostgreSQL).
- Interactive OpenAPI 3.0 specification and Swagger UI explorer at `/api/docs` and `/api/openapi.json` on Rails backend.
- Public landing page footer featuring structured Product, Resources, Project, and Attribution links.
- Authenticated account popover with direct link to `/docs`.
- Environment variable configuration templates `backend_rails/.env.example` and `frontend_react_ts/.env.example`.

- Rebuilt architecture into clean monorepo: `frontend_react_ts/` and `backend_rails/`.
- Modern React 19 + TypeScript + Vite + Tailwind CSS v4 frontend.
- Polished public landing page introducing the Forge philosophy (_"Capture first. Understand later."_).
- Ambient interactive thought canvas with `prefers-reduced-motion` accessibility support.
- Authentication views with debounced username availability checking (350ms) and live password rule enforcement.
- Authenticated thinking workspace with Seed anchor header, editorial thought timeline, and non-chat composer.
- Explicit meaning assignment mechanism for Sparks (`✦ Keep as Spark`).
- Growth synthesis engine surfacing creative tensions while strictly preserving uncertainty.
- Full API v1 namespace in Rails backend supporting session authentication and CORS with credentials.
- Test coverage for auth schemas and Rails integration endpoints.

### Changed

- Preserved existing database schema, models, and migrations in `backend_rails/`.
- Upgraded Gemini integration with resilient observational fallbacks under `Owl::GeminiAdapter`.
- Relocated and verified official logo asset at `frontend_react_ts/public/forge_logo.png`.
