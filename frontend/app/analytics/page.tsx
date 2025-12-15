'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, DollarSign } from 'lucide-react';
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

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-purple-300">Deep insights into cross-chain activity</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: '24h Volume', value: '$3.2M', change: '+15.3%', icon: DollarSign, color: 'green' },
              { label: 'Total Swaps', value: '1,247', change: '+8.2%', icon: Activity, color: 'blue' },
              { label: 'Avg Fee', value: '$2.45', change: '-5.1%', icon: TrendingUp, color: 'purple' },
              { label: 'Active Chains', value: '5', change: '+1', icon: BarChart3, color: 'yellow' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                  <span className={`text-${stat.color}-400 text-sm font-semibold`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Volume Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-3xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Weekly Volume Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                  }}
                />
                <Area type="monotone" dataKey="volume" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Chain Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Chain Activity</h2>
            <div className="space-y-4">
              {chainActivity.map((chain, i) => (
                <div key={chain.chain} className="glass-dark rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }}></div>
                      <span className="text-white font-semibold">{chain.chain}</span>
                    </div>
                    <span className="text-green-400 text-sm font-semibold">{chain.growth}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(chain.volume / 450) * 100}%`,
                          backgroundColor: chain.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-white font-bold">${chain.volume}M</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
