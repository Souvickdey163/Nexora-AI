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

---

## AI Resume Intelligence Endpoints (`/api/resumes`)

All endpoints require `Authorization: Bearer <accessToken>`.

### 1. Upload Initial Resume
`POST /api/resumes`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (PDF, max 10MB), optional `title` (string)
- **Response**: `201 Created` with created `Resume` and `ResumeVersion` (Version 1).

### 2. Upload New Resume Version
`POST /api/resumes/:resumeId/versions`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (PDF)
- **Response**: `201 Created` with new `ResumeVersion` (Version 2, 3...).

### 3. List User Resumes
`GET /api/resumes`
- **Response**: `200 OK` list of resumes with latest score & version metadata.

### 4. Get Resume Details
`GET /api/resumes/:resumeId`
- **Response**: `200 OK` resume details with all versions.

### 5. Get Version Details
`GET /api/resumes/:resumeId/versions/:versionId`
- **Response**: `200 OK` version metadata, extracted text, and parsed profile skills.

### 6. Download Version File (Secure Stream)
`GET /api/resumes/:resumeId/versions/:versionId/file`
- **Response**: `200 OK` binary PDF stream (Ownership validated via JWT).

### 7. Analyze Resume Version
`POST /api/resumes/:resumeId/versions/:versionId/analyze`
- **Body**:
  ```json
  {
    "targetRole": "Senior Fullstack Engineer",
    "targetCompany": "Nexora AI",
    "jobDescription": "Optional job description text..."
  }
  ```
- **Response**: `200 OK` structured `ResumeAnalysis` with scores (0-100), ATS breakdown, strengths, weaknesses, missing keywords/skills, recommendations, and suggested bullet point changes.

### 8. Get Analysis History
`GET /api/resumes/:resumeId/analyses?page=1&limit=10`
- **Response**: `200 OK` paginated history of all past analyses.

### 9. Get Single Analysis Details
`GET /api/resumes/:resumeId/analyses/:analysisId`
- **Response**: `200 OK` full historical analysis details.

### 10. Get Score Progression History
`GET /api/resumes/:resumeId/progress`
- **Response**: `200 OK` trajectory data showing `currentScore`, `previousScore`, `improvement`, and historical timeline.

### 11. Get Dashboard Analytics Summary
`GET /api/resumes/analytics/summary`
- **Response**: `200 OK` aggregated statistics (`totalResumes`, `totalAnalyses`, `latestScore`, `averageScore`, `strongestCategory`, `weakestCategory`, `topMissingSkills`).

### 12. Delete Resume
`DELETE /api/resumes/:resumeId`
- **Response**: `200 OK` removes database records and stored files from disk.

