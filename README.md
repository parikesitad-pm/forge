# Forge by Modula Project

[![Live Demo](https://img.shields.io/badge/Live%20Demo-frontendreactts.vercel.app-10b981?style=flat-square)](https://frontendreactts.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Ruby](https://img.shields.io/badge/Ruby-4.0.5-cc342d?style=flat-square&logo=ruby)](https://www.ruby-lang.org/)
[![Rails](https://img.shields.io/badge/Rails-8.0.5-d30001?style=flat-square&logo=rubyonrails)](https://rubyonrails.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

> **Forge — A Thinking Companion**
> _"A thought doesn't need to be complete to be worth capturing."_
> _"Capture first. Understand later."_
> _"Owl observes. The thinker decides."_

Forge is an editorial thinking companion designed for non-linear thought development, pattern discovery, and unconstrained creative synthesis.

---

## 🔗 Live Deployments & Links

- **Production Web App:** [https://frontendreactts.vercel.app](https://frontendreactts.vercel.app)
- **Cloud Backend (Railway):** _Coming Soon / Temporarily Disabled (Token Expired)_ — run locally with `bin/rails server -p 3000`
- **GitHub Repository:** [https://github.com/parikesitad-pm/forge](https://github.com/parikesitad-pm/forge)
- **Interactive Documentation:** Reachable in-app at [`/docs`](https://frontendreactts.vercel.app/docs)
- **OpenAPI 3.0 Explorer:** Available at `/api/docs` on the Rails backend

---

## ✨ Key Features

- **Session-Aware Architecture:** Smooth client-side authentication hydration with zero UI flash between public landing and thinker workspace.
- **Fragment Journaling:** Capture embryonic ideas into self-contained Fragments, anchored by a central Seed.
- **Owl Observational Engine:** Non-prescriptive reflection engine surfacing hidden tensions, cognitive mirrors, and synthesis angles without asserting certainty.
- **Sparks & Relational Growth:** Elevate resonant observations into enduring Sparks (`✦ Keep as Spark`) and synthesize cross-fragment evolution.
- **Customizable Appearance:** Full Dark, Light, and System device preference support with persistent storage.
- **Thinker Personalization:** Custom calling names, onboarding flow, and Active Storage avatar uploads.
- **Keyboard-First Workflow:** Fast composition with `Ctrl+Enter` / `⌘+Enter` submission, quick switcher modals, and instant copy/archive actions.

---

## 🏛️ Monorepo Structure

```
/
├── frontend_react_ts/   # React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion
├── backend_rails/       # Ruby 4.0.5 + Ruby on Rails 8.0.5 (API Mode) + PostgreSQL
├── CHANGELOG.md         # Keep a Changelog specification
├── LICENSE              # MIT License (c) 2026 parikesitad-pm
└── README.md
```

---

## Getting Started

### Prerequisites

- **Ruby 4.0.5** (managed via `rbenv` or `asdf`)
- **Node.js 22+ & npm**
- **PostgreSQL 18+**

### 1. Backend Setup

```bash
cd backend_rails
cp .env.example .env     # configure database and credentials
bundle install
bin/rails db:prepare
bin/rails server -p 3000
```

The API service runs on `http://localhost:3000`. OpenAPI documentation is served at `http://localhost:3000/api/docs`.

### 2. Frontend Setup

```bash
cd frontend_react_ts
cp .env.example .env     # configure API base URL
npm install
npm run dev
```

The client application runs on `http://localhost:5173`. In development, Vite automatically proxies `/api` and `/rails` requests to the Rails server.

---

## 🧪 Testing & Verification

### Backend Tests

```bash
cd backend_rails
bin/rails test
```

### Frontend Tests & Typecheck

```bash
cd frontend_react_ts
npm test
npm run build
```

---

## ☁️ Deployment Architecture

- **Frontend (Vercel):** Deployed as a single-page application (SPA) with automatic SPA routing rewrites and edge caching at [frontendreactts.vercel.app](https://frontendreactts.vercel.app).
- **Backend (Railway):** _Coming Soon / Temporarily Disabled (Token Expired)_. Containerized Docker manifest (`railway.json`) and `/up` healthcheck are prepared. Full backend capability is run locally via `bin/rails server -p 3000`.

---

## 📄 License & Attribution

Crafted by **parikesitad-pm** &copy; 2026 MODULA Project.
Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
