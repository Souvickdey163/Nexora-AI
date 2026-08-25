# ⚡ Nexora AI - Next-Gen AI Career & Placement Intelligence Platform

Nexora AI is a comprehensive, production-ready AI-driven platform for job seekers, software engineers, and candidates preparing for tech placement interviews, resume optimization, coding practice, and career mentorship.

---

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend API**: Express.js, TypeScript, Node.js.
- **Database & ORM**: PostgreSQL + Prisma ORM.
- **Authentication**: JWT, HTTP-only Refresh Token Cookies, Bcrypt Password Hashing, Nodemailer Real Email OTP, Zod Validation, OAuth 2.0 (Google, GitHub, LinkedIn).
- **Security**: Helmet, CORS, Express Rate Limiting (login brute-force, OTP spam prevention).

---

## ⚡ Quick Start

### 1. Environment Setup
Copy `.env.example` to `.env` in the root folder:
```bash
cp .env.example .env
```

### 2. Frontend Development Server (Port 3000)
```bash
npm install
npm run dev
```

### 3. Backend Express API Server (Port 5000)
```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

Check API Health: [http://localhost:5000/health](http://localhost:5000/health)

---

## 📖 Setup & Configuration Guides

Detailed step-by-step documentation for setup, database, OAuth, and API references:

- 🔒 **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Complete Authentication setup guide.
- 🗄️ **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - PostgreSQL and Prisma setup guide (macOS & Docker).
- 🔑 **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Step-by-step setup for Google, GitHub, and LinkedIn OAuth credentials.
- 📑 **[API.md](./API.md)** - Complete REST API endpoint documentation.

---

## 🧪 Running Backend Tests

To run the backend test suite:

```bash
cd backend
npm test
```
