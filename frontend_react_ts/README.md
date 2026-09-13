# Forge Frontend (React 19 + TypeScript)

Client interface for **Forge — A Thinking Companion**, built with React 19, TypeScript, Tailwind CSS v4, and Motion.

---

## 🛠️ Stack & Architecture

- **Framework:** React 19 + TypeScript 5.9
- **Bundler & Tooling:** Vite + Oxlint
- **Styling:** Tailwind CSS v4 + Motion
- **State & Data Fetching:** TanStack Query v5 + Context API
- **Form & Validation:** React Hook Form + Zod

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

The application runs on `http://localhost:5173`. Vite proxies `/api` and `/rails` to the Rails backend at `http://localhost:3000`.

---

## 🧪 Testing & Build

```bash
npm test
npm run build
```

---

## 🚢 Deployment

Configured for deployment on Vercel with SPA routing rewrite rules in `vercel.json`.

---

## 📄 License

MIT License &copy; 2026 parikesitad-pm
