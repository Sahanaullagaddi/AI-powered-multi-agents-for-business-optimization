# MedGuard AI Deployment Guide

This guide covers how to deploy the **MedGuard AI** application:
- **Backend (FastAPI)** to **Railway**
- **Frontend (Vite React)** to **Vercel**

---

## 1. Deploying the Backend to Railway

### Option A: Railway Dashboard (Recommended & GitHub Git Sync)
1. Go to [railway.app](https://railway.app/) and sign in.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. When setting up the service:
   - Set **Root Directory** to `backend`
   - Railway will automatically detect the `Dockerfile` and `railway.json` located inside `backend/`.
5. Add Environment Variables in Railway settings:
   - `GEMINI_API_KEY` = *your_google_gemini_api_key* (optional, for AI chat functionality)
   - `DATABASE_URL` = *(Optional)* Railway PostgreSQL URL. If left empty, SQLite fallback (`medguard.db`) will automatically be used.
6. Generate a Domain under **Settings** -> **Networking** -> **Generate Domain** (e.g. `https://medguard-backend.up.railway.app`).
7. Copy your deployed Railway Backend URL!

### Option B: Railway CLI
```bash
# Navigate to backend directory
cd backend

# Login to Railway
railway login

# Initialize project & deploy
railway init
railway up
```

---

## 2. Deploying the Frontend to Vercel

### Option A: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com/) and sign in.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the Project Configuration screen:
   - **Framework Preset**: Vite
   - **Root Directory**: Select `frontend` (Click Edit -> type `frontend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend.up.railway.app` *(Replace with your actual Railway backend URL)*
6. Click **Deploy**.

### Option B: Vercel CLI
```bash
# Navigate to frontend directory
cd frontend

# Deploy using Vercel CLI
npx vercel

# Follow the prompts, and set environment variable:
npx vercel env add VITE_API_BASE_URL
# Enter your Railway Backend URL when prompted, then deploy to production:
npx vercel --prod
```

---

## 3. Verification & Testing

Once both services are deployed:
1. Open your Vercel frontend URL (e.g. `https://medguard-ai.vercel.app`).
2. Run a Multi-Drug Interaction analysis test (e.g., Aspirin + Warfarin + Atorvastatin).
3. Test the AI Medical Copilot Chatbot to ensure Gemini API communication works.
