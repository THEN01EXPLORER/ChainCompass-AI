'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, DollarSign, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const volumeData = [
  { date: 'Mon', volume: 1200, transactions: 45 },
  { date: 'Tue', volume: 1900, transactions: 67 },
  { date: 'Wed', volume: 1500, transactions: 52 },
  { date: 'Thu', volume: 2200, transactions: 78 },
  { date: 'Fri', volume: 2800, transactions: 95 },
  { date: 'Sat', volume: 2400, transactions: 82 },
  { date: 'Sun', volume: 3100, transactions: 110 },
];

const chainActivity = [
  { chain: 'Polygon', volume: 450, growth: '+12%', color: '#8247E5' },
  { chain: 'Arbitrum', volume: 320, growth: '+8%', color: '#28A0F0' },
  { chain: 'Optimism', volume: 210, growth: '+15%', color: '#FF0420' },
  { chain: 'Base', volume: 150, growth: '+22%', color: '#0052FF' },
  { chain: 'Ethereum', volume: 90, growth: '+5%', color: '#627EEA' },
];

const stats = [
  { label: '24h Volume', value: '$3.2M', change: '+15.3%', icon: DollarSign, color: 'emerald' },
  { label: 'Total Swaps', value: '1,247', change: '+8.2%', icon: Activity, color: 'cyan' },
  { label: 'Avg Fee', value: '$2.45', change: '-5.1%', icon: Zap, color: 'amber' },
  { label: 'Active Chains', value: '5', change: '+1', icon: BarChart3, color: 'violet' },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  violet: { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium text-sm">{label}</p>
        <p className="text-violet-400 text-xs mt-1">
          ${payload[0]?.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-white">Advanced </span>
              <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-gray-500">Deep insights into cross-chain activity</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat, i) => {
              const colors = colorMap[stat.color];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}>
                      <stat.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Volume Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-7 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Weekly Volume Trend</h2>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +24.5% this week
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="date" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Chain Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-3xl p-7"
          >
            <h2 className="text-xl font-bold text-white mb-6">Chain Activity</h2>
            <div className="space-y-4">
              {chainActivity.map((chain, i) => (
                <motion.div
                  key={chain.chain}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="glass-dark rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                      <span className="text-white font-medium">{chain.chain}</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">{chain.growth}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-white/5 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(chain.volume / 450) * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: chain.color }}
                      />
                    </div>
                    <span className="text-white font-bold text-sm w-16 text-right">${chain.volume}M</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
