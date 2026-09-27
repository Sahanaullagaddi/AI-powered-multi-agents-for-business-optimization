# MedGuard AI Deployment Guide

This guide covers how to deploy the **MedGuard AI** application:
- **Backend (FastAPI)** to **Render** or **Koyeb** (100% Free Alternatives to Railway)
- **Frontend (Vite React)** to **Vercel**

---

## 1. Deploying the Backend to Render (Recommended Free Hosting)

### Render.com Setup (Free Tier)
1. Sign up / Log in to [render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`Sahanaullagaddi/AI-powered-multi-agents-for-business-optimization`).
4. Configure the service:
   - **Name**: `medguard-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Select **Free**
5. *(Optional)* Add Environment Variable:
   - `GEMINI_API_KEY` = *your_google_gemini_api_key*
6. Click **Create Web Service**.
7. Once deployed, Render will provide a free URL (e.g., `https://medguard-backend.onrender.com`).

---

## 2. Alternative Free Backend Hosting: Koyeb

1. Sign up at [koyeb.com](https://www.koyeb.com/).
2. Click **Create App** -> Select **GitHub**.
3. Select your repository.
4. Set **Work Directory** to `backend`.
5. Select **Builder**: `Dockerfile` (or `Python`).
6. Set **Port**: `8000`.
7. Click **Deploy**.

---

## 3. Deploying the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com/) and log in.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`Sahanaullagaddi/AI-powered-multi-agents-for-business-optimization`).
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://medguard-backend.onrender.com` *(Replace with your deployed Render backend URL)*
6. Click **Deploy**.
