import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base, sepolia, arbitrumSepolia, optimismSepolia, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'ChainCompass AI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'chaincompass-ai-demo', // Fallback for development
  chains: [
    // Testnets (preferred for free development)
    sepolia,
    arbitrumSepolia,
    optimismSepolia,
    baseSepolia,
    // Mainnets
    mainnet,
    polygon,
    arbitrum,
    optimism,
    base,
  ],
  ssr: false, // Disable SSR to avoid indexedDB issues
});

export const supportedChains = [
  { id: 1, name: 'Ethereum', symbol: 'ETH' },
  { id: 137, name: 'Polygon', symbol: 'MATIC' },
  { id: 42161, name: 'Arbitrum', symbol: 'ARB' },
  { id: 10, name: 'Optimism', symbol: 'OP' },
  { id: 8453, name: 'Base', symbol: 'BASE' },
  // Testnets
  { id: 11155111, name: 'Sepolia', symbol: 'ETH' },
  { id: 421614, name: 'Arbitrum Sepolia', symbol: 'ARB' },
  { id: 11155420, name: 'Optimism Sepolia', symbol: 'OP' },
  { id: 84532, name: 'Base Sepolia', symbol: 'BASE' },
];
