# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel
```bash
cd frontend
vercel
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Your backend URL

#### Backend on Render
1. Connect GitHub repository
2. Create new Web Service
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `OPENAI_API_KEY`
   - `LIFI_API_KEY`

---

### Option 2: Docker Compose

```bash
# Build and start
docker-compose up -d

# Stop
docker-compose down
```

**Environment Variables:**
Create `.env` file with:
```env
OPENAI_API_KEY=your-key
LIFI_API_KEY=your-key
```

---

### Option 3: Manual Deployment

#### Backend (Any VPS)
```bash
# Install dependencies
pip install -r requirements.txt

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Frontend (Static Hosting)
```bash
cd frontend
npm run build
npm run export

# Deploy 'out' folder to:
# - Netlify
# - Cloudflare Pages
# - AWS S3 + CloudFront
```

---

## Production Checklist

### Backend
- [ ] Set environment variables
- [ ] Update CORS origins (remove `*`)
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure rate limiting
- [ ] Set up logging
- [ ] Enable error tracking (Sentry)

### Frontend
- [ ] Set `NEXT_PUBLIC_API_URL`
- [ ] Enable analytics
- [ ] Configure CDN
- [ ] Set up error tracking
- [ ] Enable caching
- [ ] Optimize images

### Security
- [ ] Rotate API keys
- [ ] Enable HTTPS only
- [ ] Set secure headers
- [ ] Configure CSP
- [ ] Enable rate limiting
- [ ] Set up monitoring

---

## Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=sk-your-key
LIFI_API_KEY=your-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.com
```

---

## Monitoring

### Recommended Tools
- **Backend**: Sentry, DataDog, New Relic
- **Frontend**: Vercel Analytics, Google Analytics
- **Uptime**: UptimeRobot, Pingdom

### Health Checks
- Backend: `https://your-backend.com/health`
- Frontend: `https://your-frontend.com`

---

## Scaling

### Backend
- Use multiple workers: `gunicorn -w 4`
- Add Redis for caching
- Use load balancer
- Enable auto-scaling

### Frontend
- Use CDN (Vercel, Cloudflare)
- Enable edge caching
- Optimize images
- Use ISR (Incremental Static Regeneration)

---

## Troubleshooting

### Backend Issues
- Check logs: `docker logs backend`
- Verify environment variables
- Test health endpoint
- Check API keys

### Frontend Issues
- Check build logs
- Verify API URL
- Test in production mode locally
- Check browser console

---

## Cost Estimates

### Free Tier
- **Vercel**: Free for hobby projects
- **Render**: Free tier available
- **Total**: $0/month

### Production
- **Vercel Pro**: $20/month
- **Render Standard**: $25/month
- **Total**: ~$45/month

---

## Support

For deployment issues:
- Check documentation
- Open GitHub issue
- Contact support
