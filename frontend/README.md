# ChainCompass AI - Frontend

Modern React/Next.js frontend for ChainCompass AI cross-chain DeFi analytics platform.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **Axios** - API requests

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Features

- 🎨 Modern glassmorphism UI design
- 🌊 Smooth animations with Framer Motion
- 📊 Interactive analytics charts
- 💼 Wallet connection interface
- 🔄 Real-time swap interface
- 📱 Fully responsive design
- ⚡ Optimized performance

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── MetricsGrid.tsx  # Key metrics display
│   ├── SwapInterface.tsx # Swap form
│   ├── AnalyticsCharts.tsx # Charts
│   └── Footer.tsx       # Footer
└── lib/
    └── api.ts           # API client
```

## Connecting to Backend

Make sure your FastAPI backend is running on `http://localhost:8000` or update the `NEXT_PUBLIC_API_URL` in `.env.local`.

## License

MIT
