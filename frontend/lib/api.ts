import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SwapRequest {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromAddress?: string;
}

export interface SwapResponse {
  summary: string;
  provider?: string;
  time_seconds?: number;
  fees_usd?: number;
  output_usd?: number;
}

// Chain ID mapping for LI.FI API (numeric chain IDs)
const CHAIN_IDS: Record<string, number> = {
  'Ethereum': 1,
  'Polygon': 137,
  'Arbitrum': 42161,
  'Optimism': 10,
  'Base': 8453,
};

// Token symbols for LI.FI (they handle token resolution)
const TOKEN_SYMBOLS: Record<string, string> = {
  'ETH': 'ETH',
  'USDC': 'USDC',
  'USDT': 'USDT',
  'WBTC': 'WBTC',
  'DAI': 'DAI',
};

export const api = {
  async getSwapRoute(request: SwapRequest): Promise<SwapResponse> {
    try {
      const fromChainId = CHAIN_IDS[request.fromChain];
      const toChainId = CHAIN_IDS[request.toChain];
      const fromToken = TOKEN_SYMBOLS[request.fromToken] || request.fromToken;
      const toToken = TOKEN_SYMBOLS[request.toToken] || request.toToken;
      
      if (!fromChainId || !toChainId) {
        throw new Error('Invalid chain selected');
      }
      
      // Convert amount to wei (assuming 6 decimals for USDC/USDT, 18 for ETH)
      const decimals = fromToken === 'USDC' || fromToken === 'USDT' ? 6 : 18;
      const fromAmount = (parseFloat(request.fromAmount) * Math.pow(10, decimals)).toString();

      const params = new URLSearchParams({
        fromChain: fromChainId.toString(),
        toChain: toChainId.toString(),
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: fromAmount,
        fromAddress: request.fromAddress || '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/quote?${params.toString()}`,
        {
          timeout: 15000,
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching swap route:', error);
      if (error.response) {
        const detail = error.response.data?.detail || 'Failed to fetch swap route';
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error('Network error. Please try again.');
    }
  },

  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking backend health:', error);
      throw error;
    }
  },
};
