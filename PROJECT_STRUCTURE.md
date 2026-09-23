# Nexora AI - Project Folder Structure & Code Map 🗺️

Aapke project ka complete directory structure aur code mapping niche detail mein samjhaya gaya hai. Yeh guide aapko batayegi ki **konsa UI code kaha hai**, **konsa Backend code kaha hai**, aur dono ek dusre se kaise jude hain.

---

## 📁 Root Directory Overview

```text
Nexora/
├── frontend/        # Next.js 15 App Router (Frontend UI, Components, Pages & Client Logic)
├── backend/         # Node.js + Express + Prisma (Primary Backend API Server)
├── ai-service/      # Python FastAPI (AI Intelligence & LLM Service)
├── docs/            # Project documentation & specs
└── PROJECT_STRUCTURE.md  # (This file) Complete Project Map
```

---

## 🎨 1. Frontend Structure (`frontend/src/`)

Frontend Next.js App Router model follow karta hai:
- **`frontend/src/app/`** ➡️ **URL Routes & Pages** (E.g., `/auth`, `/dashboard`, `/interview`, `/resume`)
- **`frontend/src/components/`** ➡️ **Actual UI Visual Code & Widgets**

```text
frontend/src/
├── app/                        # 🌐 URL ROUTE PAGES
│   ├── page.tsx                # Landing Page (/)
│   ├── auth/                   # Auth Route Page (/auth)
│   │   ├── page.tsx            # Imports <AuthPageClient />
│   │   └── callback/page.tsx   # OAuth Callback Handler (/auth/callback)
│   ├── dashboard/              # Candidate Dashboard (/dashboard)
│   ├── interview/              # AI Mock Interview Page (/interview)
│   ├── resume/                 # AI Resume Analyzer Page (/resume)
│   ├── coding/                 # Code Playground Page (/coding)
│   ├── mentor/                 # AI Mentor Page (/mentor)
│   ├── analytics/              # Skill Analytics Page (/analytics)
│   └── roadmap/                # Learning Roadmap Page (/roadmap)
│
├── components/                 # 🧱 UI VISUAL CODE & COMPONENTS
│   ├── auth/                   # 🔐 AUTH & LOGIN UI COMPONENTS (NEW & MODULAR)
│   │   ├── LoginForm.tsx       # 👈 LOGIN PAGE KA PURA FORM & UI CODE
│   │   ├── SignupForm.tsx      # 👈 SIGNUP PAGE KA PURA FORM & UI CODE
│   │   ├── OtpVerificationForm.tsx # 👈 6-DIGIT OTP VERIFICATION UI CODE
│   │   ├── ForgotPasswordForm.tsx # 👈 FORGOT & RESET PASSWORD UI CODE
│   │   ├── OAuthButtons.tsx    # 👈 GOOGLE, LINKEDIN & GITHUB BUTTONS
│   │   ├── AuthHeader.tsx      # 👈 TOP HEADER (BACK LINK & THEME TOGGLE)
│   │   ├── AuthPageClient.tsx  # 👈 AUTH UI ORCHESTRATOR & CONTAINER
│   │   └── index.ts            # Barrel Exports
│   │
│   ├── interview/              # 🎙️ Mock Interview UI Components (InterviewWorkspace, AudioRecorder)
│   ├── resume/                 # 📄 Resume Analyzer UI Components (ResumeUploader, ScoreGauge)
│   ├── coding/                 # 💻 Code Editor & Terminal UI Components
│   ├── mentor/                 # 🤖 AI Chat Assistant UI Components
│   ├── dashboard/              # 📊 Dashboard Widgets & Feature Cards
│   ├── navbar/                 # 🧭 Top Navigation Bar & Theme Toggle
│   ├── footer/                 # 👣 Footer Links & Branding
│   ├── hero/                   # 🚀 Landing Page Hero Section
│   ├── sections/               # 🧩 Landing Page Sections (FAQ, Features, Testimonials)
│   └── ui/                     # 🎨 Reusable UI Components (Modal, Badge, GlowButton, StatCard)
│
├── lib/                        # 🔌 API Clients & Utilities
│   ├── api/                    # Frontend HTTP API Clients
│   │   ├── auth.ts             # Auth API endpoints handler (login, register, otp, oauth)
│   │   ├── client.ts           # Axios / Fetch client instance
│   │   └── index.ts
│   └── utils.ts
│
└── context/                    # 🌐 React Global Context
    └── AuthContext.tsx         # Global User Authentication State & Token management
```

---

## ⚙️ 2. Backend Structure (`backend/src/`)

Backend Node.js + Express API architecture follow karta hai:

```text
backend/src/
├── server.ts                   # 🚀 Server Entry Point (Listens on port 5000)
├── app.ts                      # ⚡ Express App Initialization, Middleware & Route Setup
│
├── routes/                     # 🛣️ API ROUTE DEFINITIONS
│   ├── auth.routes.ts          # Endpoints: /api/auth/login, /register, /otp, /oauth
│   ├── interview.routes.ts     # Endpoints: /api/interview/start, /submit, /analyze
│   ├── resume.routes.ts        # Endpoints: /api/resume/scan, /score, /export
│   ├── coding.routes.ts        # Endpoints: /api/coding/execute, /submissions
│   └── mentor.routes.ts        # Endpoints: /api/mentor/chat
│
├── controllers/                # 🎮 ROUTE CONTROLLERS (Request Handling & Responses)
│   ├── auth.controller.ts      # 👈 Handles Login, Registration, OTP & OAuth logic
│   ├── interview.controller.ts # Handles Mock Interview requests
│   ├── resume.controller.ts    # Handles Resume scan & scoring requests
│   ├── coding.controller.ts    # Handles Code execution requests
│   └── mentor.controller.ts    # Handles AI chat requests
│
├── services/                   # 🧠 BUSINESS LOGIC & DATABASE OPERATIONS
│   ├── auth.service.ts         # User auth logic, password hashing, JWT generation
│   ├── otp.service.ts          # OTP generation & validation logic
│   ├── email.service.ts        # Nodemailer email sending (OTP codes)
│   ├── oauth.service.ts        # Google / LinkedIn / GitHub OAuth verification
│   ├── token.service.ts        # Access token & Refresh token logic
│   └── ai.client.ts            # Client that calls Python `ai-service`
│
├── middleware/                 # 🛡️ Express Middlewares (auth.middleware.ts, rate-limiter, error handling)
└── schemas/                    # 📋 Zod Validation Schemas for API Requests
```

---

## 🤖 3. AI Service Structure (`ai-service/`)

Python FastAPI microservice for AI processing:

```text
ai-service/
├── main.py                     # 🚀 FastAPI Server Entry Point
├── providers/                  # LLM Provider Adapters (OpenAI, Gemini, Claude)
├── prompts/                    # System Prompts for AI Resume/Interview Evaluation
├── schemas/                    # Pydantic Schemas for AI Input/Output Data
└── services/                   # AI Scoring algorithms & Keyword matchers
```

---

## 🔗 4. Complete Feature Connection Map

Niche di gayi table se aap samajh sakte hain ki konsa Feature UI se Backend aur AI tak kaise juda hua hai:

| Feature Name | 🎨 Frontend UI Page Route | 🧩 Frontend UI Component File | 🛣️ Backend API Route | 🎮 Backend Controller File | 🧠 Backend Service File |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GitHub Intelligence** | `/features/github` | [`GitHubWorkspace.tsx`](file:///Users/souvickdey/Nexora/frontend/src/components/github/GitHubWorkspace.tsx) | `GET /api/github/profile`, `POST /analyze` | [`github.controller.ts`](file:///Users/souvickdey/Nexora/backend/src/controllers/github.controller.ts) | `github.service.ts` |
| **Login / Sign In** | `/auth` | [`LoginForm.tsx`](file:///Users/souvickdey/Nexora/frontend/src/components/auth/LoginForm.tsx) | `POST /api/auth/login` | [`auth.controller.ts`](file:///Users/souvickdey/Nexora/backend/src/controllers/auth.controller.ts) | `auth.service.ts` |
| **Sign Up** | `/auth` | [`SignupForm.tsx`](file:///Users/souvickdey/Nexora/frontend/src/components/auth/SignupForm.tsx) | `POST /api/auth/register` | [`auth.controller.ts`](file:///Users/souvickdey/Nexora/backend/src/controllers/auth.controller.ts) | `auth.service.ts` |
| **OTP Verification** | `/auth` | [`OtpVerificationForm.tsx`](file:///Users/souvickdey/Nexora/frontend/src/components/auth/OtpVerificationForm.tsx) | `POST /api/auth/verify-otp` | [`auth.controller.ts`](file:///Users/souvickdey/Nexora/backend/src/controllers/auth.controller.ts) | `otp.service.ts` |
| **Forgot Password** | `/auth` | [`ForgotPasswordForm.tsx`](file:///Users/souvickdey/Nexora/frontend/src/components/auth/ForgotPasswordForm.tsx) | `POST /api/auth/forgot-password` | [`auth.controller.ts`](file:///Users/souvickdey/Nexora/backend/src/controllers/auth.controller.ts) | `email.service.ts` |
| **OAuth (Google/GitHub)**| `/auth` | [`OAuthButtons.tsx`](file:///Users/souvickdey/Nexora/frontend/src/components/auth/OAuthButtons.tsx) | `GET /api/auth/oauth/:provider` | [`auth.controller.ts`](file:///Users/souvickdey/Nexora/backend/src/controllers/auth.controller.ts) | `oauth.service.ts` |
| **Mock Interview** | `/interview` | `components/interview/InterviewWorkspace.tsx` | `/api/interview/*` | `interview.controller.ts` | `ai.client.ts` |
| **Resume ATS Scanner**| `/resume` | `components/resume/ResumePageClient.tsx` | `/api/resume/*` | `resume.controller.ts` | `resume.service.ts` |
| **Coding Playground** | `/coding` | `components/coding/CodingPlayground.tsx` | `/api/coding/*` | `coding.controller.ts` | `coding/runner.ts` |
| **AI Mentor Chat** | `/mentor` | `components/mentor/MentorChat.tsx` | `/api/mentor/*` | `mentor.controller.ts` | `ai.client.ts` |

---

## 💡 Key Summary
1. **Login Page Ka Pura UI Code**: [`frontend/src/components/auth/LoginForm.tsx`](file:///Users/souvickdey/Nexora/frontend/src/components/auth/LoginForm.tsx)
2. **Signup Page Ka Pura UI Code**: [`frontend/src/components/auth/SignupForm.tsx`](file:///Users/souvickdey/Nexora/frontend/src/components/auth/SignupForm.tsx)
3. **Backend Login/Auth Logic**: [`backend/src/controllers/auth.controller.ts`](file:///Users/souvickdey/Nexora/backend/src/controllers/auth.controller.ts) & [`backend/src/services/auth.service.ts`](file:///Users/souvickdey/Nexora/backend/src/services/auth.service.ts)
