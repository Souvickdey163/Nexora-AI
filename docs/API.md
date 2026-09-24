# Nexora AI Career Copilot — Comprehensive API Documentation

Welcome to the Nexora REST API documentation. All endpoints accept and return JSON format (`application/json`). Authenticated routes require a Bearer token in the `Authorization` header: `Authorization: Bearer <jwt_access_token>`.

---

## 1. Authentication & OAuth (`/api/auth`)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | No | Register a new user. Automatically grants **10 Welcome Credits** exactly once. |
| `/api/auth/login` | `POST` | No | Authenticate user with email and password. Returns JWT access token. |
| `/api/auth/google` | `GET` | No | Initiates Google OAuth 2.0 flow. Captures profile picture (`picture`/avatar). |
| `/api/auth/google/callback` | `GET` | No | Google OAuth 2.0 callback URL. Syncs profile image and grants 10 credits if new user. |
| `/api/auth/me` | `GET` | Yes | Returns current authenticated user profile, avatar, and credit balance. |
| `/api/auth/logout` | `POST` | Yes | Clears session cookie / revokes refresh token. |

---

## 2. Credits System (`/api/credits`)

Nexora operates on a credit-based model. Each feature operation has a defined credit cost:
- Welcome Bonus: **10 Free Credits** (New users only)
- Resume ATS Analysis: **1 Credit**
- AI Mentor Chat: **1 Credit**
- AI Mock Interview Session: **3 Credits**
- Skill Assessment Quiz: **2 Credits**
- Personalized Career Roadmap: **2 Credits**
- GitHub Repository Analysis: **2 Credits**

When credits are insufficient, the API returns **HTTP status `402 Payment Required`** with `code: "INSUFFICIENT_CREDITS"`.

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/credits/balance` | `GET` | Yes | Returns current user credit balance. |
| `/api/credits/history` | `GET` | Yes | Returns transaction audit log (grants, deductions, purchases). |

---

## 3. Razorpay Payments & Webhooks (`/api/payments`)

Razorpay is integrated in **TEST MODE** with server-side HMAC-SHA256 signature verification and idempotent credit fulfillment. Frontend price or credit parameters are never trusted.

### Pricing Tiers
- **Starter Pack**: 50 Credits @ ₹499
- **Pro Pack**: 150 Credits @ ₹1,199
- **Unlimited Pack**: 500 Credits @ ₹2,999

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/payments/create-order` | `POST` | Yes | Initiates server-side Razorpay order creation for a specified pack ID. |
| `/api/payments/verify` | `POST` | Yes | Verifies Razorpay payment signature and grants credits atomically. |
| `/api/payments/webhook` | `POST` | Signature | Idempotent webhook handler verifying `x-razorpay-signature` raw body. |

---

## 4. User Profile & Avatar Management (`/api/profile`)

Supports single profile management and Google/GitHub OAuth profile picture sync.

### Avatar Fallback Logic
1. Uploaded Custom Avatar (`/uploads/avatars/...`)
2. OAuth Profile Picture (Google `picture` / GitHub `avatar_url`)
3. Generated Initials SVG Fallback (`https://ui-avatars.com/api/?name=User+Name`)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/profile` | `GET` | Yes | Fetch complete profile metadata, target role, connected accounts, and credit history. |
| `/api/profile` | `PUT` | Yes | Update target role, headline, bio, experience level, and preferred skills. |
| `/api/profile/avatar` | `POST` | Yes | Upload custom user profile image (supports `multipart/form-data`). |

---

## 5. Personalized Career Roadmap (`/api/roadmap`)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/roadmap/active` | `GET` | Yes | Fetch active career roadmap and milestones for current target role. |
| `/api/roadmap/generate` | `POST` | Yes | Generate or update personalized pathway (Deducts **2 Credits**). |
| `/api/roadmap/milestones/:id/toggle` | `PATCH` | Yes | Toggle completion status of a roadmap milestone node. |

---

## 6. Diagnostic Skill Assessment (`/api/assessment`)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/assessment/categories` | `GET` | No | Fetch list of supported CS assessment domains (DSA, DBMS, OS, Networks, System Design). |
| `/api/assessment/questions` | `GET` | Yes | Start timed diagnostic assessment session (Deducts **2 Credits**). |
| `/api/assessment/start` | `POST` | Yes | Alternative endpoint to start assessment session (Deducts **2 Credits**). |
| `/api/assessment/submit` | `POST` | Yes | Submit user answers for instant AI score evaluation and weak area feedback. |
| `/api/assessment/history` | `GET` | Yes | Returns user's past assessment attempt scores and reports. |

---

## 7. Career Analytics & KPI Trends (`/api/analytics`)

Calculates real-time performance velocity across coding problems solved, interview scores, and resume ATS metrics. Returns `hasData: false` when activity volume is zero to present actionable onboarding states.

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/analytics/dashboard` | `GET` | Yes | Fetch user score trends, difficulty distributions, and average performance metrics. |

---

## 8. Placement Intelligence & Readiness (`/api/placement`)

Provides explainable readiness score across 4 key dimensions:
1. Interview Performance (40%)
2. Coding Proficiency (30%)
3. Resume Impact (15%)
4. Roadmap Progress (15%)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/placement/readiness` | `GET` | Yes | Fetch readiness score, tier classification, verified strengths, gaps, and action items. |

---

## 9. Learning Hub (`/api/learning`)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/learning/topics` | `GET` | Yes | Fetch curated DSA patterns, system design cheat sheets, and interview masterclasses. |
| `/api/learning/progress/:topicId` | `POST` | Yes | Mark resource as completed or bookmarked. |

---

## 10. Dashboard Command Center (`/api/dashboard`)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/dashboard/overview` | `GET` | Yes | Returns aggregated stats, today's top 3 recommended actions, and activity summary. |

---

## 11. Notifications & User Activity (`/api/notifications` & `/api/activities`)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/notifications` | `GET` | Yes | Returns user in-app notifications and unread count. |
| `/api/notifications/:id/read` | `PATCH` | Yes | Mark specific notification as read. |
| `/api/notifications/read-all` | `PATCH` | Yes | Mark all notifications as read. |
| `/api/activities` | `GET` | Yes | Fetch chronological action trail of user platform activities. |
