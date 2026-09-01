# ⚡ Nexora AI - Next-Gen AI Career & Placement Intelligence Platform

Nexora AI is a comprehensive, production-ready AI-driven platform for job seekers, software engineers, and candidates preparing for tech placement interviews, resume optimization, coding practice, and career mentorship.

---

## 📁 Project Directory Structure

```
Nexora/
├── 📱 frontend/               # Next.js 16 App (React 19, TypeScript, Tailwind CSS)
│   ├── src/                  # App Router pages, AI feature workspaces, components
│   ├── public/               # Static assets & icons
│   └── package.json          # Frontend scripts & dependencies
│
├── ⚙️ backend/                # Express + TypeScript + Prisma API Server
│   ├── src/                  # Controllers, routes, services, middleware, schemas
│   ├── prisma/               # PostgreSQL schema & database migrations
│   └── package.json          # Backend scripts & dependencies
│
├── 📚 docs/                   # Centralized Setup & Technical Documentation
│   ├── API.md                # REST API endpoint reference
│   ├── AUTH_SETUP.md         # JWT & authentication architecture guide
│   ├── DATABASE_SETUP.md     # PostgreSQL & Prisma setup guide
│   └── OAUTH_SETUP.md        # Google, GitHub & LinkedIn OAuth setup
│
├── 🛠️ scripts/                # Helper & Asset Processing Scripts
│   └── logo_generator/       # Python scripts for logo design candidates
│
├── 🎨 assets/                 # Raw Design Files & Logo Assets
│   └── logo_candidates/      # SVG and PNG logo exports
│
├── package.json              # Monorepo Root workspace manager
├── .env                      # Global environment variables
└── README.md                 # Project Overview & Architecture Guide
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
# Install frontend & workspace dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Environment Setup
Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

### 3. Run Development Servers
From the root directory:
```bash
# Run Next.js Frontend (Port 3000)
npm run dev

# Run Backend Express API (Port 5000)
npm run dev:backend
```

---

## 📖 Setup & Technical Documentation

All setup guides are located in the [`docs/`](./docs) folder:

- 📑 **[API.md](./docs/API.md)** - Complete REST API endpoint documentation.
- 🔒 **[AUTH_SETUP.md](./docs/AUTH_SETUP.md)** - Complete Authentication setup guide.
- 🗄️ **[DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)** - PostgreSQL and Prisma setup guide.
- 🔑 **[OAUTH_SETUP.md](./docs/OAUTH_SETUP.md)** - Step-by-step OAuth setup guide (Google, GitHub, LinkedIn).

---

## 🧪 Running Tests & Build Verification

```bash
# Verify Frontend TypeScript & Lint
npm run lint

# Build Frontend production app
npm run build

# Run Backend Jest Test Suite
cd backend && npm test
```
