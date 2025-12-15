# 🚀 Deployment Guide - ChainCompass AI

This guide covers deploying ChainCompass AI to production using free/affordable services.

## Architecture Overview

```
┌─────────────────────────────────────┐
│    Vercel (Next.js Frontend)        │ (Free Hobby tier)
│    https://chaincompass-ai.vercel.app
└──────────────┬──────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────┐
│   Render/Fly.io (FastAPI Backend)   │ (Free tier)
│   https://chaincompass-api.onrender.com
│   - Python 3.11                     │
│   - SQLite Database                 │
│   - Rate Limiting                   │
└─────────────────────────────────────┘
```

## Prerequisites

- GitHub account (for connecting repos)
- Vercel account (free)
- Render.com account (free) OR Fly.io account (free)
- Environment variables ready:
  - `OPENAI_API_KEY` (from OpenAI)
  - `LIFI_API_KEY` (from LI.FI)

---

## Option 1: Render.com (Recommended for Beginners)

### Backend Deployment (FastAPI)

1. **Connect GitHub Repository**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +"
   - Select "Web Service"
   - Connect your ChainCompass-AI repo

2. **Configure Web Service**
   - Name: `chaincompass-api`
   - Root Directory: `.` (root)
   - Runtime: `Python 3.11`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`

3. **Add Environment Variables**
   - Click "Environment"
   - Add these secrets:
     ```
     OPENAI_API_KEY=sk-your-key-here
     LIFI_API_KEY=your-lifi-key
     DATABASE_URL=sqlite:///./chaincompass.db
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Note the URL: `https://chaincompass-api.onrender.com`

### Frontend Deployment (Next.js)

1. **Create New Service on Vercel** (see below)
2. **Set Environment Variable**
   - In Vercel Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://chaincompass-api.onrender.com`
3. **Redeploy** after adding the variable

---

## Option 2: Vercel (Frontend)

### Deploy Next.js Frontend

1. **Go to [vercel.com](https://vercel.com)**
   - Sign in with GitHub
   - Click "Add New..."
   - Select "Project"

2. **Select Repository**
   - Search for "ChainCompass-AI"
   - Click "Import"

3. **Configure Project**
   - Framework Preset: `Next.js`
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://chaincompass-api.onrender.com
     ```
   - (Replace with your actual backend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Access at: `https://chaincompass-ai.vercel.app`

---

## Option 3: Fly.io (Alternative Backend)

### Deploy FastAPI Backend to Fly.io

1. **Install Fly CLI**
   ```bash
   # Windows
   choco install flyctl
   
   # macOS
   brew install flyctl
   
   # Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   flyctl auth login
   ```

3. **Create Fly App**
   ```bash
   cd /path/to/ChainCompass-AI
   flyctl launch
   ```
   - App name: `chaincompass-api` (or custom)
   - Choose region closest to you
   - Don't deploy yet (answer 'n' when asked)

4. **Configure fly.toml**
   ```toml
   app = "chaincompass-api"
   primary_region = "lax"  # Los Angeles
   
   [build]
   builder = "paas"
   
   [env]
   OPENAI_API_KEY = "sk-your-key"
   LIFI_API_KEY = "your-lifi-key"
   
   [[services]]
   internal_port = 8000
   protocol = "tcp"
   
   [[services.ports]]
   port = 80
   handlers = ["http"]
   
   [[services.ports]]
   port = 443
   handlers = ["tls", "http"]
   
   [http_service]
   internal_port = 8000
   ```

5. **Deploy**
   ```bash
   flyctl deploy
   ```
   - Access at: `https://chaincompass-api.fly.dev`

---

## Post-Deployment Verification

### Test Backend Health
```bash
curl https://chaincompass-api.onrender.com/health
# Should return:
# {"status":"ok","version":"2.0.0",...}
```

### Test API Endpoint
```bash
curl "https://chaincompass-api.onrender.com/api/v1/chains"
# Should return list of supported chains
```

### Test Frontend
Visit: `https://chaincompass-ai.vercel.app`
- Check console for errors
- Test wallet connection
- Try a swap

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT summaries |
| `LIFI_API_KEY` | Yes | LI.FI API key for swap routes |
| `NEXT_PUBLIC_API_URL` | Yes (Frontend) | Backend URL |
| `DATABASE_URL` | No | SQLite path (defaults to `./chaincompass.db`) |

---

## Monitoring & Logs

### Render.com
- Logs: Dashboard → Service → Logs
- Monitor: Dashboard → Monitoring

### Vercel
- Logs: Project → Deployments → Logs
- Analytics: Project → Analytics

### Fly.io
```bash
flyctl logs -a chaincompass-api
```

---

## Scaling & Production Tips

### Performance
- ✅ Frontend cached + CDN (Vercel)
- ✅ Backend with connection pooling
- ✅ TTL cache (60s) for quotes
- ✅ Rate limiting (50 req/min per address)

### Security
- ✅ CORS allowlist (no wildcard)
- ✅ Input validation
- ✅ HTTPS enforced
- ✅ Environment variables (not hardcoded)

### Cost
- **Free tier**: ~$0/month
  - Vercel: 100GB bandwidth/month
  - Render: 750 hrs/month (free dyno)
  - Fly.io: 3 shared VMs + $3/month data

- **Paid tiers** (if scaling):
  - Vercel Pro: $20/month
  - Render: ~$7/month per service
  - Fly.io: $0.15/hour per VM

---

## Troubleshooting

### `CORS error` in frontend
- Check `allowed_origins` in [main.py](../main.py)
- Add your Vercel domain to the list
- Redeploy backend

### `Database locked` error
- SQLite doesn't support concurrent writes
- Use PostgreSQL (Supabase) for production
- See below for upgrade path

### `Rate limit exceeded` error
- User hit 50 requests/min or 10 tx/min
- These are configurable in [validation.py](../validation.py)
- Increase limits in production

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` is set
- Check backend is running: `curl backend-url/health`
- Check CORS: Backend logs should show requests

---

## Upgrade Path: Production Database

For production with multiple users, use PostgreSQL instead of SQLite:

### Option A: Supabase (PostgreSQL)
```bash
# Install
pip install psycopg2-binary

# Update DATABASE_URL to:
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
```

### Option B: Railway (PostgreSQL)
- Simple UI to provision PostgreSQL
- $5/month free credit
- Deploy from GitHub

### Option C: Neon (Serverless PostgreSQL)
- Free tier: 3GB storage
- No credit card required
- Excellent for small projects

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Render/Fly
3. ✅ Set environment variables
4. ✅ Test API endpoints
5. ⬜ (Optional) Upgrade to PostgreSQL
6. ⬜ (Optional) Set up monitoring/alerts
7. ⬜ (Optional) Custom domain + SSL

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Fly.io Docs**: https://fly.io/docs/
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Next.js Deployment**: https://nextjs.org/docs/deployment/

---

**Happy deploying! 🚀**
