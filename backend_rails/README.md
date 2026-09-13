# Forge Backend (Rails 8 API)

Backend service for **Forge — A Thinking Companion**, built with Ruby on Rails 8 in API-only mode, backed by PostgreSQL.

---

## 🛠️ Stack & Architecture

- **Ruby:** 4.0.5
- **Rails:** 8.0.5 (`--api`)
- **Database:** PostgreSQL 18+
- **Authentication:** BCrypt session cookies with HTTP-only credentials
- **Storage:** Active Storage (Disk in development, S3/Cloud in production)
- **API Spec:** OpenAPI 3.0 & Swagger UI at `/api/docs`

---

## 🚀 Running Locally

```bash
# 1. Install gems
bundle install

# 2. Setup database
bin/rails db:prepare

# 3. Start server on port 3000
bin/rails server -b 0.0.0.0 -p 3000
```

---

## 🧪 Testing

```bash
bin/rails test
```

---

## 🚢 Production & Deployment

Containerized via `Dockerfile` and configured for Railway with `railway.json`. Healthcheck endpoint is available at `/up`.

---

## 📄 License

MIT License &copy; 2026 parikesitad-pm
