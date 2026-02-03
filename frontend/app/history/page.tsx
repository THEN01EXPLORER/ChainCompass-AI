'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, XCircle, Loader, AlertCircle, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Transaction {
  id: number;
  from_chain_id: number;
  to_chain_id: number;
  from_token: string;
  to_token: string;
  from_amount: string;
  to_amount: string;
  tx_hash: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  confirmed_at?: string;
}

const chainColors: Record<number, string> = {
  1: '#627EEA',
  137: '#8247E5',
  42161: '#28A0F0',
  10: '#FF0420',
  8453: '#0052FF',
  11155111: '#9CA3AF',
  421614: '#28A0F0',
  11155420: '#FF0420',
  84532: '#0052FF',
};

export default function HistoryPage() {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getTransactionHistory(address, 50);
        setTransactions(response.transactions || []);
      } catch (err: any) {
        console.error('Error fetching history:', err);
        setError(err.message || 'Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [address, isConnected]);

  const chainNameById = (id: number) => {
    const chains: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism',
      8453: 'Base',
      11155111: 'Sepolia',
      421614: 'Arb Sepolia',
      11155420: 'Op Sepolia',
      84532: 'Base Sepolia',
    };
    return chains[id] || 'Unknown';
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20'
        };
      case 'pending':
        return {
          icon: Loader,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          spin: true
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20'
        };
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Clock className="w-6 h-6 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            </div>
            <p className="text-gray-500 ml-[60px]">View your cross-chain swap activity</p>
          </motion.div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Wallet Not Connected</h3>
              <p className="text-gray-500">Connect your wallet to view transaction history</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-8 text-center border border-rose-500/20"
            >
              <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Error Loading History</h3>
              <p className="text-gray-500">{error}</p>
            </motion.div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-8 h-8 text-violet-400 animate-spin mb-4" />
              <span className="text-gray-400">Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Transactions Yet</h3>
              <p className="text-gray-500">Your swap history will appear here</p>
            </motion.div>
          ) : (
            <div className="space-y-3 relative">
              {/* Timeline line */}
              <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-violet-500/50 via-blue-500/30 to-transparent" />

              {transactions.map((tx, idx) => {
                const statusConfig = getStatusConfig(tx.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative pl-12"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-[15px] top-6 w-4 h-4 rounded-full border-2 border-gray-800"
                      style={{ backgroundColor: chainColors[tx.from_chain_id] || '#8b5cf6' }}
                    />

                    <div className="glass rounded-xl p-5 hover:bg-white/[0.03] transition-all group">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Route */}
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-0.5">{chainNameById(tx.from_chain_id)}</div>
                            <div className="text-lg font-semibold text-white">{tx.from_token}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-600" />
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-0.5">{chainNameById(tx.to_chain_id)}</div>
                            <div className="text-lg font-semibold text-white">{tx.to_token}</div>
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Amount</div>
                          <div className="text-white font-medium">{tx.from_amount}</div>
                        </div>

                        {/* Status */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
                          <StatusIcon className={`w-4 h-4 ${statusConfig.color} ${statusConfig.spin ? 'animate-spin' : ''}`} />
                          <span className={`text-sm font-medium capitalize ${statusConfig.color}`}>
                            {tx.status}
                          </span>
                        </div>

                        {/* Time */}
                        <div className="text-right">
                          <div className="text-sm text-gray-400">{formatTime(tx.created_at)}</div>
                          <div className="text-xs text-gray-600">
                            {new Date(tx.created_at).toLocaleTimeString()}
                          </div>
                        </div>

                        {/* TX Link */}
                        <a
                          href={`https://etherscan.io/tx/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          View
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
