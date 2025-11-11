# ChainCompass AI - Frontend Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Or use the batch file from root:
```bash
start-frontend.bat
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 What's Included

### Modern UI Features
- **Glassmorphism Design** - Beautiful frosted glass effects
- **Gradient Backgrounds** - Purple to blue gradient theme
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Layout** - Works on all devices
- **Interactive Charts** - Real-time data visualization

### Components

1. **Header** - Navigation with wallet connection button
2. **MetricsGrid** - Key performance indicators
3. **SwapInterface** - Main swap form with AI route finding
4. **AnalyticsCharts** - Volume and token distribution charts
5. **Footer** - Links and credits

### Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons

## 🔧 Configuration

### Environment Variables
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Connecting to Backend
The frontend expects your FastAPI backend at `http://localhost:8000`. Make sure it's running:
```bash
uvicorn main:app --reload
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with all components
│   └── globals.css         # Global styles & utilities
├── components/
│   ├── Header.tsx          # Top navigation
│   ├── MetricsGrid.tsx     # 4 metric cards
│   ├── SwapInterface.tsx   # Swap form & results
│   ├── AnalyticsCharts.tsx # Bar & pie charts
│   └── Footer.tsx          # Footer with links
├── lib/
│   └── api.ts              # API client functions
├── public/
│   └── grid.svg            # Background pattern
└── .env.local              # Environment config
```

## 🎯 Key Features

### Wallet Connection
- Click "Connect Wallet" in header
- Visual feedback when connected
- Ready for Web3 integration

### Swap Interface
- Select source and destination chains
- Choose tokens from dropdown
- Enter amount
- AI finds optimal route
- Shows estimated output, fees, and time

### Analytics
- Real-time volume charts by chain
- Token distribution pie chart
- Interactive tooltips
- Responsive design

## 🚀 Deployment

### Build for Production
```bash
cd frontend
npm run build
```

### Deploy Options
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker**

### Vercel Deployment
```bash
npm install -g vercel
vercel
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme.

### Animations
Modify Framer Motion settings in components for different effects.

### API Integration
Update `lib/api.ts` to connect to your real backend endpoints.

## 📝 Next Steps

1. **Add Web3 Integration** - Connect to MetaMask/WalletConnect
2. **Real API Calls** - Replace mock data with actual backend
3. **Transaction History** - Add user transaction tracking
4. **More Chains** - Expand supported blockchain list
5. **Advanced Analytics** - Add more charts and insights

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

---

Built with ❤️ for ChainCompass AI
