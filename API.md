# Nexora AI - Authentication API Documentation

Base URL: `http://localhost:5000/api/auth` (or `/api/v1/auth`)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description message",
  "code": "OPTIONAL_ERROR_CODE",
  "errors": {
    "field": ["Field specific error message"]
  }
}
```

---

## Endpoints

### 1. Health Check
`GET /health`

**Response:**
```json
{
  "status": "ok",
  "service": "Nexora Backend Express API",
  "database": "connected",
  "timestamp": "2026-08-25T12:00:00.000Z"
}
```

---

### 2. User Registration
`POST /api/auth/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful! Verification OTP code has been sent to your email.",
  "data": {
    "user": {
      "id": "uuid-v4",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "name": "John Doe",
      "emailVerified": false,
      "status": "UNVERIFIED"
    }
  }
}
```

---

### 3. Verify Email OTP
`POST /api/auth/verify-email`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email address verified successfully!",
  "data": {
    "user": {
      "id": "uuid-v4",
      "email": "john.doe@example.com",
      "emailVerified": true,
      "status": "ACTIVE"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "48b6c0...",
      "expiresIn": "7d"
    }
  }
}
```

---

### 4. User Login
`POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sign in successful! Welcome to Nexora AI.",
  "data": {
    "user": {
      "id": "uuid-v4",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "status": "ACTIVE"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "48b6c0...",
      "expiresIn": "7d"
    }
  }
}
```

---

### 5. Resend Verification OTP
`POST /api/auth/resend-verification-otp`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

---

### 6. Forgot Password (Request Reset OTP)
`POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

---

### 7. Verify Reset OTP
`POST /api/auth/verify-reset-otp`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

---

### 8. Reset Password
`POST /api/auth/reset-password`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```

---

### 9. Get Authenticated User Profile
`GET /api/auth/me`

**Headers:**
`Authorization: Bearer <accessToken>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-v4",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "name": "John Doe",
      "emailVerified": true,
      "status": "ACTIVE",
      "profile": {
        "headline": "AI Candidate",
        "skills": []
      }
    }
  }
}
```

---

### 10. User Logout
`POST /api/auth/logout`

**Headers:**
`Authorization: Bearer <accessToken>`

---

### 11. Refresh Token
`POST /api/auth/refresh`

**Request Body or Cookie:**
```json
{
  "refreshToken": "48b6c0..."
}
```

---

### 12. Social OAuth Endpoints
- `GET /api/auth/google`: Initiates Google OAuth consent screen.
- `GET /api/auth/google/callback`: Handles Google OAuth callback code.
- `GET /api/auth/github`: Initiates GitHub OAuth authorization.
- `GET /api/auth/github/callback`: Handles GitHub OAuth callback code.
- `GET /api/auth/linkedin`: Initiates LinkedIn OpenID authorization.
- `GET /api/auth/linkedin/callback`: Handles LinkedIn callback code.
