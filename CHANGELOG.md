# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Anti-flashbang inline pre-render script in `index.html` preventing white screen flash on page refresh by defaulting to dark mode.
- Spark action toggle on every thought bubble (both thinker entries and owl reflections) with minimal icon and spark indicator.
- Thinker profile popover anchored to bottom sidebar showing avatar, `@username`, "Thinker since [date]", Settings link, and Sign Out action.
- "Thinker since" membership date badge and avatar file upload with instant preview and multipart persistence in `/app/settings`.
- Display theme selection card (Dark, Light, System) in `/app/settings` connected to `ThemeProvider`.
- Animated neural canvas background on `/docs` matching the public landing page aesthetic.
- Functional thought migration workflow in `MoveToFragmentModal` transferring entries to the target fragment and auto-archiving the source.
- Clear error status mapping in `apiClient.ts` diagnosing offline backend services and 405/404/502 states.
- Comprehensive documentation across root `README.md`, `backend_rails/README.md`, and `frontend_react_ts/README.md` with live production deployment badges and links.
- Multi-theme support (Dark, Light, and System device preference) with settings picker and persistent storage.
- Vite proxy configuration for `/rails` to deliver Active Storage avatar assets directly in development.
- Slim ChatGPT-style thought bubbles with hover-triggered actions (Keep as Spark, Copy to clipboard, and timestamp).
- Animated shrinking header on scroll across `/app`, fragment workspace, and `/docs`.
- Modal `MoveToFragmentModal` allowing thinkers to move and link thoughts between existing fragments.
- Sidebar Archive view for managing archived thought fragments.
- Debounced email availability check endpoint (`/api/v1/auth/check-email`) and fullname input field in `/register`.
- Sequential 2-step post-registration onboarding modal ("Mau dipanggil siapa?" and creative interests).
- Collapsible ChatGPT-style workspace sidebar (`AppSidebar`) with hoverable logo, New Fragment button, recent thought list, and thinker profile card.
- Top workspace navigation bar with breadcrumb tracking (`Fragments / [Title]`) and 3-dots action menu (Delete, Archive, Move).
- Avatar image upload with file preview and Active Storage multipart persistence in settings view.
- Deliberate GitHub/Forge-style loading skeleton animations (`Skeleton.tsx`) for fragment lists and thought details.
- ScrollSpy section tracking, static pinned sidebar, and breadcrumb header in `/docs`.

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
