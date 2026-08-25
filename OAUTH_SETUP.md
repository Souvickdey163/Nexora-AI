# Nexora AI - OAuth Setup Guide (Google, GitHub, LinkedIn)

This guide walks you through setting up OAuth 2.0 applications for Google, GitHub, and LinkedIn, obtaining credentials, and configuring your `.env` file for local development.

---

## 1. 🌐 Google OAuth 2.0 Setup Guide

### Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a project** > **New Project**.
3. Name your project (e.g., `Nexora AI`) and click **Create**.

### Step 2: Configure OAuth Consent Screen
1. In the left navigation, go to **APIs & Services** > **OAuth consent screen**.
2. Select **User Type**: **External** and click **Create**.
3. Fill in App Information:
   - **App name**: `Nexora AI`
   - **User support email**: Your email address
   - **Developer contact email**: Your email address
4. Click **Save and Continue**.
5. Under **Scopes**, click **Add or Remove Scopes** and select:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
6. Click **Save and Continue**. Under **Test users**, add your own Gmail address so you can test locally.

### Step 3: Create OAuth 2.0 Client Credentials
1. Navigate to **APIs & Services** > **Credentials**.
2. Click **+ Create Credentials** > **OAuth client ID**.
3. Select **Application type**: **Web application**.
4. Name: `Nexora Local Dev`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `http://localhost:5000`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:5000/api/auth/google/callback`
7. Click **Create**. Copy your **Client ID** and **Client Secret**.

### Step 4: Add to `.env`
```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## 2. 🐙 GitHub OAuth Setup Guide

### Step 1: Register New GitHub OAuth Application
1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Under **OAuth Apps**, click **New OAuth App**.
3. Fill out the application details:
   - **Application name**: `Nexora AI`
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: `Nexora AI Career & Placement Platform`
   - **Authorization callback URL**: `http://localhost:5000/api/auth/github/callback`
4. Click **Register application**.

### Step 2: Generate Client Secret
1. Copy the **Client ID** displayed on the app page.
2. Click **Generate a new client secret**.
3. Copy the generated **Client Secret** immediately.

### Step 3: Add to `.env`
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
```

---

## 3. 💼 LinkedIn OAuth / OpenID Connect Setup Guide

### Step 1: Create LinkedIn Developer Application
1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps).
2. Click **Create app**.
3. Provide:
   - **App name**: `Nexora AI`
   - **LinkedIn Page**: Link your LinkedIn company/personal page
   - **App logo**: Upload a logo image
4. Agree to terms and click **Create app**.

### Step 2: Enable Products / Products Tab
1. Click the **Products** tab in your app setting.
2. Select and request access for:
   - **Sign In with LinkedIn using OpenID Connect** (Primary support for OAuth 2.0 OpenID Connect).

### Step 3: Configure Auth Settings
1. Go to the **Auth** tab.
2. Under **OAuth 2.0 settings** > **Authorized redirect URLs for your app**, click the edit icon and add:
   - `http://localhost:5000/api/auth/linkedin/callback`
3. Copy your **Client ID** and **Client Secret**.

### Step 4: Add to `.env`
```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback
```

---

## 🧪 Testing OAuth Locally

1. Start both frontend (`npm run dev` on port 3000) and backend (`npm run dev` in `backend/` on port 5000).
2. Open `http://localhost:3000/auth`.
3. Click **Google**, **GitHub**, or **LinkedIn** social sign-in buttons.
4. Complete provider authentication.
5. The backend will process the callback code, locate/create the user record in PostgreSQL, issue a JWT access token, and redirect back to `http://localhost:3000/auth/callback?token=...` which seamlessly logs you into `http://localhost:3000/dashboard`.
