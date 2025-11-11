# 🚀 ChainCompass AI - Quick Start Guide

## Start the Frontend (3 Steps)

### Option 1: Using Batch File (Windows)
```bash
start-frontend.bat
```

### Option 2: Manual Start
```bash
cd frontend
npm run dev
```

### Option 3: First Time Setup
```bash
cd frontend
npm install
npm run dev
```

## Access the App
Open your browser: **http://localhost:3000**

## Start the Backend (Separate Terminal)
```bash
# Activate virtual environment
.venv\Scripts\activate

# Start FastAPI server
uvicorn main:app --reload
```

Backend will run on: **http://localhost:8000**

## What You'll See

### 🎨 Modern UI Features
- Glassmorphism design with purple/blue gradients
- Smooth animations on hover and interactions
- Responsive layout (works on mobile)
- Professional metrics dashboard
- Interactive charts

### 🔄 Swap Interface
1. Select source chain and token
2. Select destination chain and token
3. Enter amount
4. Click "Find Best Route"
5. See estimated output, fees, and time

### 📊 Analytics
- Volume by chain (bar chart)
- Token distribution (pie chart)
- Key metrics cards

## Tech Stack
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts
- **Lucide Icons** - Icons

## File Structure
```
frontend/
├── app/
│   ├── page.tsx         # Main page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Top nav
│   ├── MetricsGrid.tsx  # Metrics cards
│   ├── SwapInterface.tsx # Swap form
│   ├── AnalyticsCharts.tsx # Charts
│   └── Footer.tsx       # Footer
└── lib/
    └── api.ts           # API client
```

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

### Troubleshooting
```bash
# Port already in use
npx kill-port 3000

# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Next Steps

### 1. Connect to Real Backend
Update `lib/api.ts` to use your FastAPI endpoints

### 2. Add Web3 Integration
```bash
npm install ethers wagmi viem
```

### 3. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### 4. Customize Design
- Edit colors in `tailwind.config.ts`
- Modify animations in components
- Add new features

## Features Ready to Implement

✅ Wallet connection (UI ready)
✅ Swap interface (functional)
✅ Analytics dashboard (working)
✅ Responsive design (mobile-ready)
✅ Loading states (implemented)
✅ Error handling (basic)

🔜 Web3 integration
🔜 Real transaction execution
🔜 User authentication
🔜 Transaction history
🔜 Advanced analytics

## Support

- **Frontend Guide**: See `FRONTEND_GUIDE.md`
- **Comparison**: See `FRONTEND_COMPARISON.md`
- **Issues**: Check console for errors

## Performance Tips

1. Use production build for testing: `npm run build && npm start`
2. Enable caching in `.env.local`
3. Optimize images in `public/` folder
4. Use lazy loading for heavy components

---

**Built with ❤️ for ChainCompass AI**

Happy coding! 🎉
