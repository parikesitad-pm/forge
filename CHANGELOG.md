# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
