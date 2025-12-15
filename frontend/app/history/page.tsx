'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { api } from '@/lib/api';

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
    // Refresh every 30s
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Loader className="w-5 h-5 text-yellow-400 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Clock className="w-10 h-10 text-purple-400" />
            Transaction History
          </h1>
          <p className="text-gray-400">View all your cross-chain swaps and transactions</p>
        </motion.div>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 p-6 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6" />
            <span>Connect your wallet to view transaction history</span>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 text-red-400 p-6 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </motion.div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="ml-4 text-gray-400">Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-12 text-center"
          >
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No transactions yet</h3>
            <p className="text-gray-500">Your swaps will appear here</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {transactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-dark rounded-lg p-6 hover:bg-white/15 transition-all cursor-pointer"
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  {/* From → To */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">{chainNameById(tx.from_chain_id)}</div>
                        <div className="text-lg font-semibold text-white">{tx.from_token}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400 mx-2" />
                      <div className="text-center">
                        <div className="text-sm text-gray-400">{chainNameById(tx.to_chain_id)}</div>
                        <div className="text-lg font-semibold text-white">{tx.to_token}</div>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="md:col-span-1">
                    <div className="text-sm text-gray-400">Amount</div>
                    <div className="text-white font-semibold">{tx.from_amount}</div>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-1 flex items-center gap-2">
                    {getStatusIcon(tx.status)}
                    <span className={`text-sm font-semibold capitalize ${
                      tx.status === 'completed' ? 'text-green-400' :
                      tx.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="md:col-span-1 text-right">
                    <div className="text-sm text-gray-400">{formatTime(tx.created_at)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* TX Hash */}
                  <div className="md:col-span-1">
                    <a
                      href={`https://etherscan.io/tx/${tx.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 truncate block"
                    >
                      {tx.tx_hash.slice(0, 10)}...
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
