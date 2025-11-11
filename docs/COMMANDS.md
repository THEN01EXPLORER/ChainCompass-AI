# ⚡ Quick Commands - ChainCompass AI

## 🚀 Start Everything (Easiest!)

```bash
start-all.bat
```

**This starts both backend and frontend automatically!**

---

## 🔧 Manual Start (Two Terminals)

### Terminal 1: Backend
```bash
.venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 🧪 Test Commands

### Test Backend
```bash
test-backend.bat
```

### Test Backend Health
```bash
curl http://localhost:8000/health
```

### Test Frontend
Open browser: http://localhost:3000

---

## 🛑 Stop Commands

### Stop Backend
Press `Ctrl + C` in backend terminal

### Stop Frontend
Press `Ctrl + C` in frontend terminal

### Stop All
Close both terminal windows

---

## 📦 Installation Commands

### Backend Setup (First Time)
```bash
# Create virtual environment
python -m venv .venv

# Activate it
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys
# OPENAI_API_KEY=sk-...
# LIFI_API_KEY=...
```

### Frontend Setup (First Time)
```bash
cd frontend
npm install
```

---

## 🔄 Restart Commands

### Restart Backend
```bash
# Stop with Ctrl+C, then:
uvicorn main:app --reload
```

### Restart Frontend
```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Restart Everything
```bash
# Close terminals and run:
start-all.bat
```

---

## 🐛 Troubleshooting Commands

### Kill Port 8000 (Backend)
```bash
npx kill-port 8000
```

### Kill Port 3000 (Frontend)
```bash
npx kill-port 3000
```

### Reinstall Backend Dependencies
```bash
.venv\Scripts\activate
pip install -r requirements.txt --force-reinstall
```

### Reinstall Frontend Dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Clear Frontend Cache
```bash
cd frontend
rm -rf .next
npm run dev
```

---

## 📝 Development Commands

### Backend Development
```bash
# Activate venv
.venv\Scripts\activate

# Start with auto-reload
uvicorn main:app --reload

# Start on different port
uvicorn main:app --reload --port 8001

# Start with debug logs
uvicorn main:app --reload --log-level debug
```

### Frontend Development
```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🚀 Deployment Commands

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Frontend (Vercel)
```bash
cd frontend
vercel
```

### Deploy Backend (Render)
```bash
# Push to GitHub, then connect on Render dashboard
git add .
git commit -m "Deploy backend"
git push
```

---

## 🔍 Diagnostic Commands

### Check Python Version
```bash
python --version
```

### Check Node Version
```bash
node --version
npm --version
```

### Check Virtual Environment
```bash
# Should show (.venv) in prompt
.venv\Scripts\activate
```

### Check Backend Status
```bash
curl http://localhost:8000/health
```

### Check Frontend Status
```bash
curl http://localhost:3000
```

---

## 📊 Useful Commands

### View Backend Logs
Backend logs appear in the terminal where you ran `uvicorn`

### View Frontend Logs
Frontend logs appear in the terminal where you ran `npm run dev`

### View Browser Console
Press `F12` in browser → Console tab

### View Network Requests
Press `F12` in browser → Network tab

---

## 🎯 Most Used Commands

### Daily Development
```bash
# Start everything
start-all.bat

# Or manually:
# Terminal 1
.venv\Scripts\activate
uvicorn main:app --reload

# Terminal 2
cd frontend
npm run dev
```

### Testing
```bash
# Test backend
test-backend.bat

# Test frontend
# Open http://localhost:3000 in browser
```

### Troubleshooting
```bash
# Kill ports
npx kill-port 8000
npx kill-port 3000

# Restart
start-all.bat
```

---

## 💡 Pro Tips

### Keep Terminals Open
Don't close the terminal windows while developing

### Watch for Errors
Check both terminal windows for error messages

### Use API Docs
Visit http://localhost:8000/docs to test backend directly

### Use Browser DevTools
Press F12 to see frontend errors and network requests

---

## 🎉 Quick Start Checklist

- [ ] Run `start-all.bat`
- [ ] Wait for both servers to start
- [ ] Open http://localhost:3000
- [ ] Test a swap
- [ ] Check http://localhost:8000/docs

---

**All commands in one place!** ⚡

**Just run `start-all.bat` to get started!** 🚀
