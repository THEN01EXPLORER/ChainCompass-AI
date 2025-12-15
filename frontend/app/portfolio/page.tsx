'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const portfolioData = [
  { token: 'ETH', amount: '2.5', value: '$5,250', change: '+12.5%', color: '#627EEA' },
  { token: 'USDC', amount: '10,000', value: '$10,000', change: '+0.1%', color: '#2775CA' },
  { token: 'WBTC', amount: '0.15', value: '$6,450', change: '+8.3%', color: '#F7931A' },
  { token: 'MATIC', amount: '5,000', value: '$3,500', change: '-2.1%', color: '#8247E5' },
  { token: 'ARB', amount: '1,200', value: '$1,800', change: '+15.7%', color: '#28A0F0' },
];

const pieData = portfolioData.map(item => ({
  name: item.token,
  value: parseFloat(item.value.replace('$', '').replace(',', '')),
}));

const COLORS = portfolioData.map(item => item.color);

export default function PortfolioPage() {
  const totalValue = portfolioData.reduce((sum, item) => 
    sum + parseFloat(item.value.replace('$', '').replace(',', '')), 0
  );

  const totalChange = '+8.7%';
  const totalChangeValue = '+$2,340';

  const exportPortfolio = () => {
    const csv = [
      ['Token', 'Amount', 'Value', 'Change'],
      ...portfolioData.map(item => [item.token, item.amount, item.value, item.change])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
              <p className="text-purple-300">Track your crypto assets across all chains</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportPortfolio}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </motion.button>
          </motion.div>

          {/* Total Value Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-2">Total Portfolio Value</div>
                <div className="text-5xl font-bold text-white mb-2">
                  ${totalValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">{totalChange}</span>
                  <span className="text-gray-400">({totalChangeValue})</span>
                </div>
              </div>
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '12px',
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Assets List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Assets</h2>
            <div className="space-y-4">
              {portfolioData.map((asset, i) => (
                <motion.div
                  key={asset.token}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass-dark rounded-xl p-6 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.token[0]}
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">{asset.token}</div>
                        <div className="text-gray-400 text-sm">{asset.amount} tokens</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-white font-bold text-xl">{asset.value}</div>
                        <div className={`text-sm font-semibold flex items-center gap-1 ${
                          asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {asset.change.startsWith('+') ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {asset.change}
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {((parseFloat(asset.value.replace('$', '').replace(',', '')) / totalValue) * 100).toFixed(1)}%
                      </div>
                    </div>
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
