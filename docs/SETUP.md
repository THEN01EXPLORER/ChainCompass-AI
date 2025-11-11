# Setup Guide

## Quick Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ChainCompass-AI.git
cd ChainCompass-AI
```

### 2. Environment Variables
```bash
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Backend Setup
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start Application
```bash
# Windows: Use batch file
start-all.bat

# Or manually:
# Terminal 1: uvicorn main:app --reload
# Terminal 2: cd frontend && npm run dev
```

### 6. Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Troubleshooting

### Port Already in Use
```bash
npx kill-port 3000
npx kill-port 8000
```

### Module Not Found
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend && npm install
```

### TypeScript Errors
```bash
cd frontend
rm -rf .next
npm run dev
```
