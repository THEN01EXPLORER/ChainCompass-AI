'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Zap, Clock, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

const chains = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Sepolia', 'Arbitrum Sepolia', 'Optimism Sepolia', 'Base Sepolia'];
const tokens = ['ETH', 'USDC', 'USDT', 'WBTC', 'DAI'];

import { useAccount } from 'wagmi';

export default function SwapInterface() {
  const { address, isConnected } = useAccount();

  const [fromChain, setFromChain] = useState('Polygon');
  const [toChain, setToChain] = useState('Arbitrum');
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('ETH');
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
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
        route_data: response,
      });
    } catch (err: any) {
      console.error('Swap error:', err);
      setError(err.message || 'Failed to fetch swap route');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteSwap = async () => {
    if (!isConnected || !address || !result?.route_data) {
      setError('Wallet not connected or no route selected');
      return;
    }

    setTxLoading(true);
    setError(null);

    try {
      const fromChainId = chains.includes(fromChain) ? (fromChain === 'Polygon' ? 137 : fromChain === 'Arbitrum' ? 42161 : 1) : 137;
      const toChainId = chains.includes(toChain) ? (toChain === 'Polygon' ? 137 : toChain === 'Arbitrum' ? 42161 : 1) : 42161;

      const txRes = await api.submitTransaction({
        user_address: address,
        from_chain_id: fromChainId,
        to_chain_id: toChainId,
        from_token: fromToken,
        to_token: toToken,
        from_amount: amount,
        to_amount: result.output,
        tx_hash: 'pending-' + Date.now(),
      });

      setTxHash(txRes.tx_hash);
      setTimeout(() => setResult(null), 3000);
    } catch (err: any) {
      console.error('Execute error:', err);
      setError(err.message || 'Failed to execute swap');
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Zap className="w-8 h-8 text-yellow-400" />
        AI-Powered Swap
      </h2>

      {!isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 p-4 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5" />
          <span>Connect wallet to execute swaps</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

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
            onClick={() => {
              const temp = fromChain;
              setFromChain(toChain);
              setToChain(temp);
            }}
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
          disabled={loading || !isConnected}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Finding Best Route...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Find Best Route
            </>
          )}
        </motion.button>

        {/* Result Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2 font-semibold mb-4 text-green-400">
              <Zap className="w-5 h-5" />
              Route Found!
            </div>

            {result.summary && (
              <div className="text-gray-300 text-sm mb-4 p-3 bg-white/5 rounded-xl">
                {result.summary}
              </div>
            )}

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

            {result.provider && (
              <div className="text-center text-sm text-gray-400 mt-2">
                via {result.provider}
              </div>
            )}

            {isConnected && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExecuteSwap}
                disabled={txLoading}
                className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {txLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  'Execute Swap'
                )}
              </motion.button>
            )}

            {txHash && (
              <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <p className="text-sm text-blue-300">✓ Transaction submitted!</p>
                <p className="text-xs text-gray-400 mt-1">TX: {txHash.slice(0, 20)}...</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
