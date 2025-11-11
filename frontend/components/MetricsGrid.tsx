'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Link2 } from 'lucide-react';

const metrics = [
  {
    label: 'Total Volume',
    value: '$1.2B',
    change: '+2.5%',
    isPositive: true,
    icon: Activity,
  },
  {
    label: 'Transactions',
    value: '15,203',
    change: '-1.8%',
    isPositive: false,
    icon: TrendingUp,
  },
  {
    label: 'Avg Swap Time',
    value: '85s',
    change: '-12%',
    isPositive: true,
    icon: Activity,
  },
  {
    label: 'Supported Chains',
    value: '12',
    change: '+2',
    isPositive: true,
    icon: Link2,
  },
];

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="glass rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-3 rounded-xl">
              <metric.icon className="w-6 h-6 text-purple-300" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                metric.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {metric.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {metric.change}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-white">{metric.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
