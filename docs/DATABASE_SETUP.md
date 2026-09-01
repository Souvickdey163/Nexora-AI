# Nexora AI - PostgreSQL & Prisma Database Setup Guide

This guide provides step-by-step instructions for configuring PostgreSQL and Prisma ORM on **macOS** (both native local installation and Docker container option).

---

## Option 1: Native macOS Setup (Homebrew)

### Step 1: Install PostgreSQL via Homebrew
```bash
brew install postgresql@16
```

### Step 2: Start PostgreSQL Service
```bash
brew services start postgresql@16
```

### Step 3: Create Database & User
Connect to PostgreSQL interactive console:
```bash
psql postgres
```

Inside the `psql` prompt, execute:
```sql
CREATE USER nexora_user WITH PASSWORD 'nexora_password';
CREATE DATABASE nexora_db OWNER nexora_user;
GRANT ALL PRIVILEGES ON DATABASE nexora_db TO nexora_user;
\q
```

### Step 4: Configure DATABASE_URL in `.env`
Update `.env` in the root directory:
```env
DATABASE_URL="postgresql://nexora_user:nexora_password@localhost:5432/nexora_db?schema=public"
```

---

## Option 2: Docker Setup (Fastest & Easiest)

If you have Docker / Docker Desktop installed on macOS, launch PostgreSQL instantly with one command:

```bash
docker run --name nexora-postgres \
  -e POSTGRES_USER=nexora_user \
  -e POSTGRES_PASSWORD=nexora_password \
  -e POSTGRES_DB=nexora_db \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Check running container status:
```bash
docker ps
```

---

## ⚙️ Prisma ORM Migration & Seeding Steps

After PostgreSQL is running and `DATABASE_URL` is set, execute the following commands inside the `backend/` directory:

### Step 5: Install Backend Dependencies (if not already installed)
```bash
cd backend
npm install
```

### Step 6: Generate Prisma Client
```bash
npm run prisma:generate
```

### Step 7: Create & Apply Database Migrations
```bash
npx prisma migrate dev --name init_auth_schema
```
*Alternatively, for quick prototyping without migration files:*
```bash
npm run prisma:push
```

### Step 8: Seed Database with Demo Account
```bash
npm run prisma:seed
```

### Step 9: Inspect Database Tables with Prisma Studio (Optional)
```bash
npx prisma studio
```
Opens Prisma Studio web UI at `http://localhost:5555`.

### Step 10: Start Backend Server
```bash
npm run dev
```

---

## 🛠️ Database Schema Overview

- **`User`**: Core user entity (`id`, `email`, `passwordHash`, `firstName`, `lastName`, `emailVerified`, `avatar`, `status`, `lastLoginAt`).
- **`OAuthAccount`**: Provider link (`GOOGLE`, `GITHUB`, `LINKEDIN`) with provider user ID.
- **`OtpVerification`**: SHA-256 hashed OTP codes, expiration dates, type (`REGISTRATION`, `PASSWORD_RESET`), attempt counters.
- **`Session`**: Access & refresh tokens, user agents, IP addresses, revocation status.
- **`UserProfile`**: AI career profile data (`headline`, `bio`, `skills`, social links).
