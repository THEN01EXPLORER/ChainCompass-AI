'use client';

import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const volumeData = [
  { name: 'Polygon', value: 450, color: '#8247E5' },
  { name: 'Arbitrum', value: 320, color: '#28A0F0' },
  { name: 'Optimism', value: 210, color: '#FF0420' },
  { name: 'Base', value: 150, color: '#0052FF' },
  { name: 'Ethereum', value: 90, color: '#627EEA' },
];

const tokenData = [
  { name: 'USDC', value: 55, color: '#2775CA' },
  { name: 'ETH', value: 25, color: '#627EEA' },
  { name: 'USDT', value: 12, color: '#26A17B' },
  { name: 'WBTC', value: 5, color: '#F7931A' },
  { name: 'Other', value: 3, color: '#8b5cf6' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium text-sm">{label || payload[0]?.name}</p>
        <p className="text-gray-400 text-xs mt-1">
          {payload[0]?.dataKey === 'value' ? '$' : ''}{payload[0]?.value}M
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Volume Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass rounded-3xl p-7"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <BarChart3 className="w-5 h-5 text-violet-400" />
            </div>
            Volume by Chain
          </h3>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            +12.5%
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={volumeData} barCategoryGap="20%">
            <XAxis
              dataKey="name"
              stroke="#4b5563"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#4b5563"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {volumeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Token Distribution */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass rounded-3xl p-7"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <PieChartIcon className="w-5 h-5 text-cyan-400" />
            </div>
            Token Distribution
          </h3>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={tokenData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {tokenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5">
            {tokenData.map((token) => (
              <div key={token.name} className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: token.color }}
                />
                <span className="text-sm text-gray-400">{token.name}</span>
                <span className="text-sm font-medium text-white">{token.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
