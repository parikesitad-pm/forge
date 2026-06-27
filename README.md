# Forge

> **Transform scattered thoughts into structured knowledge.**

Forge is an AI-powered thinking workspace built with **Ruby on Rails 8**. Instead of treating ideas as documents or chat histories, Forge treats them as **Fragments**—small pieces of thought that evolve through conversation, reflection, and AI-assisted reasoning.

Forge is designed for people who constantly collect ideas but struggle to organize them. Rather than replacing human thinking, Forge helps users capture thoughts before they disappear and gradually transform them into structured knowledge.

---

## 🌐 Live Demo

**Application**

https://forge-production-bbfc.up.railway.app/

---

# Why Forge?

Traditional note-taking applications are built around documents.

AI chat applications are built around conversations.

Forge is built around **thinking**.

Instead of asking users to organize everything upfront, Forge encourages them to capture ideas first, then gradually discover patterns through AI-assisted exploration.

---

# Core Concepts

```text
Seed
   │
   ▼
Fragment
   │
   ▼
Observation
   │
   ▼
Growth
```

### 🌱 Seed

The starting point of an idea.

Every Fragment begins with a Seed that defines its scope and intent.

### 🧩 Fragment

A Fragment is an unfinished thought.

It may be a note, a question, an idea, a hypothesis, or a piece of knowledge.

Forge assumes ideas are incomplete by default.

### 💬 Observation

Instead of generating final answers, AI participates as a thinking partner.

Observations help challenge assumptions, ask better questions, and explore different perspectives.

### 🌳 Growth

As conversations continue, important insights become Sparks and contribute to the Fragment's overall Growth.

Knowledge is accumulated instead of regenerated.

---

# Features

- 🌱 Fragment-based thinking workspace
- 🤖 AI-assisted brainstorming
- 💬 Observation conversations
- 📌 Pin observations into Sparks
- 🌙 Dark / Light mode
- 🔐 Authentication
- ⚡ Hotwire (Turbo + Stimulus)
- 🎨 Tailwind CSS
- 📱 Responsive design

---

# AI Philosophy

Forge is **not** designed to generate answers.

It is designed to improve thinking.

The AI acts as a collaborative partner by:

- asking better questions
- exploring alternative perspectives
- refining ideas through conversation
- helping users connect scattered thoughts

---

# AI Providers

Current

- Google Gemini

Planned

- OpenAI
- Anthropic
- Ollama
- OpenRouter

The application architecture is provider-agnostic, making it straightforward to support multiple AI backends.

---

# Tech Stack

## Backend

- Ruby 3.4
- Ruby on Rails 8
- PostgreSQL
- Puma

## Frontend

- Hotwire
- Turbo
- Stimulus
- Tailwind CSS
- Importmap

## Deployment

- Railway
- PostgreSQL (Railway)

---

# Running Locally

```bash
git clone https://github.com/parikesitad-pm/forge.git

cd forge

bundle install

bin/rails db:prepare

bin/dev
```

Open:

```
http://localhost:3000
```

---

# Environment Variables

```env
GOOGLE_API_KEY=your_google_gemini_api_key
```

Production additionally requires:

```env
DATABASE_URL=
SECRET_KEY_BASE=
RAILS_MASTER_KEY=
```

---

# Deployment

Forge is currently deployed on Railway.

Required environment variables:

```text
RAILS_ENV=production
DATABASE_URL
SECRET_KEY_BASE
RAILS_MASTER_KEY
GOOGLE_API_KEY
```

Railway public networking target port:

```
8080
```

---

# Roadmap

- [x] Authentication
- [x] Fragment workspace
- [x] AI observations
- [x] Sparks
- [ ] Growth engine
- [ ] AI memory
- [ ] Semantic search
- [ ] Knowledge graph
- [ ] Embeddings
- [ ] Multi-provider AI
- [ ] Ollama support
- [ ] Team collaboration

---

# Contributing

Contributions, discussions, and feedback are always welcome.

If you have ideas for improving Forge, feel free to open an issue or submit a pull request.

---

# License

MIT License
