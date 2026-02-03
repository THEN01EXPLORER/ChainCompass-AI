'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Download, Wallet } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const portfolioData = [
  { token: 'ETH', amount: '2.5', value: '$5,250', change: '+12.5%', color: '#627EEA', icon: 'Ξ' },
  { token: 'USDC', amount: '10,000', value: '$10,000', change: '+0.1%', color: '#2775CA', icon: '$' },
  { token: 'WBTC', amount: '0.15', value: '$6,450', change: '+8.3%', color: '#F7931A', icon: '₿' },
  { token: 'MATIC', amount: '5,000', value: '$3,500', change: '-2.1%', color: '#8247E5', icon: 'M' },
  { token: 'ARB', amount: '1,200', value: '$1,800', change: '+15.7%', color: '#28A0F0', icon: 'A' },
];

const pieData = portfolioData.map(item => ({
  name: item.token,
  value: parseFloat(item.value.replace('$', '').replace(',', '')),
  color: item.color,
}));

export default function PortfolioPage() {
  const totalValue = portfolioData.reduce((sum, item) =>
    sum + parseFloat(item.value.replace('$', '').replace(',', '')), 0
  );

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium text-sm">{payload[0]?.name}</p>
          <p className="text-gray-400 text-xs mt-1">
            ${payload[0]?.value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-white">Your </span>
                <span className="gradient-text">Portfolio</span>
              </h1>
              <p className="text-gray-500">Track your crypto assets across all chains</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportPortfolio}
              className="flex items-center gap-2 px-5 py-2.5 glass hover:bg-white/[0.08] rounded-xl text-white font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </motion.div>

          {/* Total Value Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-elevated rounded-3xl p-8 mb-10"
          >
            <div className="flex items-center justify-between flex-wrap gap-8">
              <div>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Wallet className="w-4 h-4" />
                  Total Portfolio Value
                </div>
                <div className="text-5xl font-bold text-white mb-3">
                  ${totalValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-sm">+8.7%</span>
                  </div>
                  <span className="text-gray-500 text-sm">+$2,340 (24h)</span>
                </div>
              </div>
              <div className="w-52 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
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
            className="glass rounded-3xl p-7"
          >
            <h2 className="text-xl font-bold text-white mb-6">Your Assets</h2>
            <div className="space-y-3">
              {portfolioData.map((asset, i) => (
                <motion.div
                  key={asset.token}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="glass-dark rounded-xl p-5 group cursor-pointer"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.icon}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">{asset.token}</div>
                        <div className="text-gray-500 text-sm">{asset.amount} tokens</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-white font-bold text-xl">{asset.value}</div>
                        <div className={`text-sm font-medium flex items-center justify-end gap-1 ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                          {asset.change.startsWith('+') ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          {asset.change}
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm min-w-[50px] text-right">
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
