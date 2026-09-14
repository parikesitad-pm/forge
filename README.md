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

## 🚀 Project Status & Progress Tracker

### ✅ Completed & Live in Production (`v0.2.0-patch`)
- [x] **Core SaaS & Atomic Architecture:** Monorepo Rails 8 + React 19 TypeScript + Tailwind CSS v4, dark-first anti-flashbang theme, dan sistem responsif.
- [x] **Fragment Workspace & Sticky Seed:** SeedHeader ringkas dan sticky di bagian atas saat di-scroll, timeline dengan densitas tipografi tinggi, dan composer input sticky di bawah.
- [x] **Active Sparks di Bawah Seed:** Sparks terintegrasi nempel persis di bawah jangkar Seed di dalam sticky header (menghilangkan label "kept").
- [x] **Pemisahan Display Title & Seed:** Rename hanya memodifikasi judul tampilan (`fragments.title`), menjaga keaslian teks Seed dasar (`fragments.content`).
- [x] **Isolasi Database Archive & Penghapusan "Move To":** Lifecycle arsip riil via `archived_at`, query terisolasi total, tampilan arsip khusus dengan aksi Restore/Delete, serta penghapusan fitur "Move to".
- [x] **Google Gemini 3.6 Flash Live Integration:** Model adapter `gemini-3.6-flash` dengan 2048 token limit untuk reasoning/thinking tokens.
- [x] **Open-Minded Owl Companion:** Memahami lirik musik, konsep koding, cerita fiksi, rencana bisnis, dan puisi tanpa memaksakan refleksi introspektif. Aturan utama: *"Owl observes. The thinker decides."*
- [x] **Public Fragment Sharing:** Tautan publik berbasis slug ramah pembaca + token acak 8-hex (`/share/@username/:share_slug`), mode baca hening read-only, dan aksi pencabutan instan (Revoke).
- [x] **Settings Dialog Responsif (ChatGPT/Claude Style):** 5 tab terstruktur: Account (avatar upload, DOB picker, kalkulasi umur), Personalization, Memory, Owl Instructions, Security.
- [x] **Transparent Memory:** Manajemen memori transparan dengan toggle preferensi, sumber eksplisit (`explicit`, `profile`, `confirmed`), tanpa inferensi AI diam-diam.
- [x] **Forge Reflections Engine:** Milestone perjalanan akun (3mo, 6mo, 9mo, 1yr, 18mo, 2yr) dan refleksi Ulang Tahun dengan prioritas penjadwalan, typing guards, dan `prefers-reduced-motion`.
- [x] **Pembaruan Docs & FAQ:** Halaman `/faq` komprehensif 30+ pertanyaan, perbaikan sticky header & sidebar di `/docs`, dan modal fallback Swagger API.
- [x] **Testing & CI Gate:** 12 Vitest tests lulus (100%), 10 Rails tests dengan 64 assertions lulus (100%), build production bersih 0 error.

### ⏳ In Progress / Planned (Forge Auth Patch)
- [ ] **Email Verification via 6-Digit OTP:** Registrasi membutuhkan verifikasi OTP 5 menit via Mailtrap Sandbox dengan digest SHA-256 dan cooldown resend.
- [ ] **Forgot Password via OTP:** Alur reset sandi aman dengan OTP tujuan terpisah dan invalidasi sesi aktif.
- [ ] **Google OAuth (Rails + OmniAuth):** Integrasi `omniauth-google-oauth2` di backend dengan safe account linking (tanpa menduplikasi akun ber-email sama).
- [ ] **Soft Delete & Account Recovery:** Deaktivasi akun via `revoked_at` (*"This Forge account has gone quiet"*), pengiriman kode pemulihan, peninjauan profil muted, dan pembukaan akun (*"Your chapter is open again"*).

---

## ✨ Key Features

- **Session-Aware Architecture:** Smooth client-side authentication hydration with zero UI flash between public landing and thinker workspace.
- **Fragment Journaling:** Capture embryonic ideas into self-contained Fragments, anchored by a central Seed.
- **Owl Observational Engine:** Non-prescriptive reflection engine surfacing hidden tensions, cognitive mirrors, and synthesis angles without asserting certainty.
- **Sparks & Relational Growth:** Elevate resonant observations into enduring Sparks (`✦ Active Sparks`) and synthesize cross-fragment evolution.
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
