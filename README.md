# 🧭 ChainCompass AI

> AI-powered cross-chain DeFi route optimization platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://www.python.org/)

A production-ready full-stack DeFi platform that finds the best cross-chain swap routes using AI-powered analysis.

## ✨ Features

- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations
- 🤖 **AI-Powered** - OpenAI GPT-4 generates human-friendly route explanations
- ⚡ **Real-Time Quotes** - Live swap quotes from LI.FI aggregator
- 🔗 **Multi-Chain** - Support for Ethereum, Polygon, Arbitrum, Optimism, and Base
- 📊 **Analytics** - Interactive charts and performance metrics
- 🚀 **Production Ready** - Optimized, cached, and error-handled

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ChainCompass-AI.git
cd ChainCompass-AI
```

2. **Set up environment variables**
```bash
# Create .env file in root directory
cp .env.example .env

# Add your API keys:
# OPENAI_API_KEY=sk-your-key
# LIFI_API_KEY=your-key
```

3. **Install dependencies**

**Backend:**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

4. **Start the application**

**Option 1: One command (Windows)**
```bash
start-all.bat
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
.venv\Scripts\activate
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Open your browser**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     Next.js Frontend (Port 3000)    │
│  React 19 + TypeScript + Tailwind   │
└──────────────┬──────────────────────┘
               │ REST API
┌──────────────▼──────────────────────┐
│    FastAPI Backend (Port 8000)      │
│  Python + LangChain + OpenAI        │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐         ┌─────▼─────┐
│ LI.FI  │         │  OpenAI   │
│  API   │         │   GPT-4   │
└────────┘         └───────────┘
```

## 📁 Project Structure

```
ChainCompass-AI/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   └── public/              # Static assets
├── main.py                  # FastAPI backend
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (create this)
└── README.md               # This file
```

## 🎯 API Endpoints

### Backend (FastAPI)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/health` | GET | Health check with system status |
| `/api/v1/quote` | GET | Get swap quote with AI summary |
| `/api/v1/quote/detailed` | GET | Detailed quote with route breakdown |
| `/api/v1/chains` | GET | List supported blockchains |
| `/api/v1/tokens` | GET | List supported tokens |
| `/api/v1/stats` | GET | API usage statistics |
| `/api/v1/compare` | POST | Compare multiple routes |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required
OPENAI_API_KEY=sk-your-openai-api-key
LIFI_API_KEY=your-lifi-api-key

# Optional
API_BASE_URL=http://localhost:8000
```

### Frontend Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🌐 Supported Chains & Tokens

### Chains
- Ethereum (Chain ID: 1)
- Polygon (Chain ID: 137)
- Arbitrum (Chain ID: 42161)
- Optimism (Chain ID: 10)
- Base (Chain ID: 8453)

### Tokens
- ETH, USDC, USDT, WBTC, DAI

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel
```

### Backend (Render)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy with:
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:8000/health
```

### Test Frontend
Open http://localhost:3000 and try a swap:
- From: Polygon
- To: Arbitrum
- Token: USDC
- Amount: 100

## 📊 Performance

- **Frontend**: ~1-2s initial load, 90+ Lighthouse score
- **Backend**: <50ms cached, 2-5s uncached
- **Cache**: 60-second TTL, 1000 entry capacity

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Axios

### Backend
- FastAPI
- Python 3.10+
- LangChain
- OpenAI GPT-4
- httpx (async)
- Pydantic
- cachetools

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Krishnav Mahajan**
- GitHub: [@THENO1EXPLORER](https://github.com/THENO1EXPLORER)

## 🙏 Acknowledgments

- [LI.FI](https://li.fi/) - Cross-chain aggregation
- [OpenAI](https://openai.com/) - AI summaries
- Built for DeFiTimez Multichain Mayhem Hackathon

## 📞 Support

- Documentation: See `/docs` folder
- Issues: [GitHub Issues](https://github.com/yourusername/ChainCompass-AI/issues)
- API Docs: http://localhost:8000/docs
- Security: See [SECURITY.md](SECURITY.md)

## 🤝 Contributing

We welcome contributions! Please see:
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Code of conduct
- [CHANGELOG.md](CHANGELOG.md) - Version history

## 📋 Additional Resources

- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to production
- [API Documentation](docs/API.md) - Complete API reference
- [Security Policy](SECURITY.md) - Report vulnerabilities
- [Docker Setup](docker-compose.yml) - Container deployment

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

## 📄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Built with ❤️ for the DeFi community**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ChainCompass-AI?style=social)](https://github.com/yourusername/ChainCompass-AI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/ChainCompass-AI?style=social)](https://github.com/yourusername/ChainCompass-AI/network/members)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/ChainCompass-AI)](https://github.com/yourusername/ChainCompass-AI/issues)
