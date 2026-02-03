'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, Zap, Clock, DollarSign, Loader2, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

const chains = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Sepolia', 'Arbitrum Sepolia', 'Optimism Sepolia', 'Base Sepolia'];
const tokens = ['ETH', 'USDC', 'USDT', 'WBTC', 'DAI'];

const tokenColors: Record<string, string> = {
  ETH: '#627EEA',
  USDC: '#2775CA',
  USDT: '#26A17B',
  WBTC: '#F7931A',
  DAI: '#F5AC37',
};

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

  const TokenBadge = ({ token }: { token: string }) => (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
      style={{ backgroundColor: tokenColors[token] || '#8b5cf6' }}
    >
      {token[0]}
    </div>
  );

  return (
    <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            Smart Swap
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Routing Active
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-2xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Connect wallet to execute swaps</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {/* From Section */}
          <div className="glass-dark rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-400 text-sm font-medium">From</label>
              <TokenBadge token={fromToken} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <select
                value={fromChain}
                onChange={(e) => setFromChain(e.target.value)}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
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
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
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
              className="w-full bg-transparent border-none text-white text-3xl font-light focus:outline-none placeholder:text-gray-600"
            />
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center -my-2 relative z-20">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => {
                const temp = fromChain;
                setFromChain(toChain);
                setToChain(temp);
              }}
              className="bg-gradient-to-br from-violet-600 to-blue-600 p-3 rounded-xl shadow-lg shadow-violet-500/20 border border-violet-400/20"
            >
              <ArrowDownUp className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* To Section */}
          <div className="glass-dark rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-400 text-sm font-medium">To</label>
              <TokenBadge token={toToken} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <select
                value={toChain}
                onChange={(e) => setToChain(e.target.value)}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
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
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              >
                {tokens.map((token) => (
                  <option key={token} value={token} className="bg-gray-900">
                    {token}
                  </option>
                ))}
              </select>
            </div>
            {result && (
              <div className="text-3xl text-white font-light">
                ≈ {result.output} <span className="text-lg text-gray-400">{toToken}</span>
              </div>
            )}
          </div>

          {/* Find Route Button */}
          <motion.button
            whileHover={{ scale: 1.01, boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)' }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSwap}
            disabled={loading || !isConnected}
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white font-semibold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Finding Best Route...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Find Best Route</span>
              </>
            )}
          </motion.button>

          {/* Result Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="glass rounded-2xl p-6 space-y-5 border border-emerald-500/20"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Route Found</span>
                </div>

                {result.summary && (
                  <div className="text-gray-400 text-sm p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                    {result.summary}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/[0.03] rounded-xl">
                    <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-2">
                      <DollarSign className="w-3.5 h-3.5" />
                      Output
                    </div>
                    <div className="text-white font-bold text-lg">${result.output}</div>
                  </div>
                  <div className="text-center p-4 bg-white/[0.03] rounded-xl">
                    <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-2">
                      <DollarSign className="w-3.5 h-3.5" />
                      Fees
                    </div>
                    <div className="text-white font-bold text-lg">${result.fee}</div>
                  </div>
                  <div className="text-center p-4 bg-white/[0.03] rounded-xl">
                    <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      Time
                    </div>
                    <div className="text-white font-bold text-lg">{result.time}</div>
                  </div>
                </div>

                {result.provider && (
                  <div className="text-center text-xs text-gray-500">
                    via <span className="text-gray-400">{result.provider}</span>
                  </div>
                )}

                {isConnected && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleExecuteSwap}
                    disabled={txLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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

                <AnimatePresence>
                  {txHash && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                    >
                      <p className="text-sm text-blue-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Transaction submitted
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {txHash.slice(0, 24)}...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
