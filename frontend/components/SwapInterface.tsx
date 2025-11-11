'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Zap, Clock, DollarSign } from 'lucide-react';

const chains = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'];
const tokens = ['ETH', 'USDC', 'USDT', 'WBTC', 'DAI'];

export default function SwapInterface() {
  const [fromChain, setFromChain] = useState('Polygon');
  const [toChain, setToChain] = useState('Arbitrum');
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('ETH');
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    output: string;
    fee: string;
    time: string;
    provider?: string;
    summary?: string;
    error?: boolean;
  } | null>(null);

  const handleSwap = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const { api } = await import('@/lib/api');
      
      const response = await api.getSwapRoute({
        fromChain,
        toChain,
        fromToken,
        toToken,
        fromAmount: amount,
      });

      setResult({
        output: response.output_usd?.toFixed(2) || '0',
        fee: response.fees_usd?.toFixed(2) || '0',
        time: response.time_seconds ? `${response.time_seconds}s` : 'N/A',
        provider: response.provider || 'Unknown',
        summary: response.summary || 'Route found successfully',
      });
    } catch (error: any) {
      console.error('Swap error:', error);
      setResult({
        output: '0',
        fee: '0',
        time: 'Error',
        provider: 'Error',
        summary: error.message || 'Failed to find route. Please try again.',
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Zap className="w-8 h-8 text-yellow-400" />
        AI-Powered Swap
      </h2>

      <div className="space-y-6">
        {/* From Section */}
        <div className="glass-dark rounded-2xl p-6">
          <label className="text-gray-400 text-sm mb-2 block">From</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              value={fromChain}
              onChange={(e) => setFromChain(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {chains.map((chain) => (
                <option key={chain} value={chain} className="bg-gray-900">
                  {chain}
                </option>
              ))}
            </select>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {tokens.map((token) => (
                <option key={token} value={token} className="bg-gray-900">
                  {token}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={swapChains}
            className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full"
          >
            <ArrowDownUp className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* To Section */}
        <div className="glass-dark rounded-2xl p-6">
          <label className="text-gray-400 text-sm mb-2 block">To</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              value={toChain}
              onChange={(e) => setToChain(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {chains.map((chain) => (
                <option key={chain} value={chain} className="bg-gray-900">
                  {chain}
                </option>
              ))}
            </select>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {tokens.map((token) => (
                <option key={token} value={token} className="bg-gray-900">
                  {token}
                </option>
              ))}
            </select>
          </div>
          {result && (
            <div className="text-2xl text-white font-semibold">
              ≈ {result.output} {toToken}
            </div>
          )}
        </div>

        {/* Find Route Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSwap}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
        >
          {loading ? 'Finding Best Route...' : '🚀 Find Best Route'}
        </motion.button>

        {/* Result Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-dark rounded-2xl p-6 space-y-4 ${result.error ? 'border-2 border-red-500/50' : ''}`}
          >
            <div className={`flex items-center gap-2 font-semibold mb-4 ${result.error ? 'text-red-400' : 'text-green-400'}`}>
              <Zap className="w-5 h-5" />
              {result.error ? 'Error Finding Route' : 'Route Found!'}
            </div>
            
            {result.summary && (
              <div className="text-gray-300 text-sm mb-4 p-3 bg-white/5 rounded-xl">
                {result.summary}
              </div>
            )}
            
            {!result.error && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Output
                  </div>
                  <div className="text-white font-bold">${result.output}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Fees
                  </div>
                  <div className="text-white font-bold">${result.fee}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Time
                  </div>
                  <div className="text-white font-bold">{result.time}</div>
                </div>
              </div>
            )}
            
            {result.provider && !result.error && (
              <div className="text-center text-sm text-gray-400 mt-2">
                via {result.provider}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
