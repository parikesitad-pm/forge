# Forge by Modula Project

> **Forge — A Thinking Companion**
> _"A thought doesn't need to be complete to be worth capturing."_
> _"Capture first. Understand later."_
> _"Owl observes. The thinker decides."_

---

## 🏛️ Architecture

```
/
├── frontend_react_ts/   # React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion
├── backend_rails/       # Ruby 4.0.5 + Ruby on Rails 8.0.5 + PostgreSQL
├── CHANGELOG.md         # Keep a Changelog documentation
├── LICENSE              # MIT License (c) 2026 parikesitad-pm
└── README.md
```

---

## 📚 Documentation & API Reference

- **Comprehensive Documentation:** Reachable in the app at [`/docs`](http://localhost:5173/docs) covering architecture, setup, testing, deployment (Vercel + Railway + PostgreSQL), environment variables, and troubleshooting.
- **OpenAPI 3.0 / Swagger UI:** Interactive explorer available at [`/api/docs`](http://localhost:3000/api/docs) with raw spec at [`/api/openapi.json`](http://localhost:3000/api/openapi.json).

---

## 🚀 Running Locally

### 1. Prerequisites

- Ruby 4.0.5 (via `rbenv`)
- PostgreSQL 18+
- Node.js 22+ & npm

### 2. Backend Setup

```bash
cd backend_rails
bundle install
bin/rails db:prepare
bin/rails server -p 3000
```

Backend API will be accessible on `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend_react_ts
npm install
npm run dev
```

Frontend application will be accessible on `http://localhost:5173`.
Vite automatically proxies `/api` calls to the Rails backend at `http://localhost:3000`.

---

## 🧭 Core Mental Model

- **Fragment:** A raw thought captured before it disappears.
- **Seed:** The first thought captured in a Fragment, anchoring the scope.
- **User Thought:** Continuing reflection inside an editorial journal (not chat bubbles).
- **Observation:** Owl notices patterns and questions assumptions without prescribing certainty.
- **Spark:** Meaningful observations explicitly marked by the thinker (`✦ Keep as Spark`).
- **Growth:** Relational synthesis reflecting on Seed + Sparks while preserving uncertainty.

---

## 🧪 Testing

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

## 📄 License

MIT License &copy; 2026 parikesitad-pm
