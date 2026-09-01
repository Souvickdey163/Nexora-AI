# Nexora AI - Authentication Setup Guide

This guide details the architecture, features, and configuration of the production-ready authentication backend built for Nexora AI.

---

## 🚀 Key Features

1. **Email + Password Authentication**
   - Secure account registration and login.
   - Password hashing using `bcryptjs` (salt rounds: 10).
   - Email verification enforcement (unverified accounts cannot log in).

2. **Real Email OTP Verification**
   - Cryptographically secure 6-digit numeric OTP generation (`crypto`).
   - SHA-256 OTP hashing before database persistence (plain text OTP is never stored).
   - 10-minute expiration timeline.
   - Resend rate limiting (60-second cooldown per resend).
   - Maximum attempt protection (5 invalid attempts lock the OTP).
   - Professional Nexora dark HTML email template delivered via Nodemailer.

3. **Forgot & Reset Password Flow**
   - Secure request endpoint with user email privacy.
   - OTP reset token generation and verification.
   - New password criteria validation (min 8 chars, uppercase, lowercase, number).

4. **OAuth 2.0 / OpenID Connect Integration**
   - **Google OAuth**: OpenID Connect (`openid`, `email`, `profile`).
   - **GitHub OAuth**: User profile & email retrieval (`read:user`, `user:email`).
   - **LinkedIn OAuth**: OpenID Connect (`openid`, `profile`, `email`).
   - Auto account linkage with existing registered email addresses.

5. **JWT & Session Management**
   - Signed JSON Web Tokens (`JWT_SECRET`, default 7-day expiration).
   - HTTP-only, secure, SameSite cookies for refresh tokens.
   - Session tracking & revocation in PostgreSQL (`Session` model).

6. **Security & Protection**
   - **Helmet**: HTTP header security.
   - **CORS**: Scoped strictly to `CLIENT_URL`.
   - **Rate Limiting**: `express-rate-limit` for login brute-force and OTP spam prevention.
   - **Zod Validation**: Strict request payload schema validation.

---

## 🛠️ Quick Start

### 1. Configure Environment Variables
Copy `.env.example` to `.env` in the root workspace:

```bash
cp .env.example .env
```

Set `JWT_SECRET` to a strong secret key:
```env
JWT_SECRET=your_custom_secure_jwt_secret_key_2026
```

### 2. Start the Backend API
Navigate to the `backend` folder and run the development server:

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`. You can test health status at:
`http://localhost:5000/health`
