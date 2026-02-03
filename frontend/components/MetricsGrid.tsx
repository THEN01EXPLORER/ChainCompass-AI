'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Link2, DollarSign, Clock } from 'lucide-react';

const metrics = [
  {
    label: 'Total Volume',
    value: '$1.2B',
    change: '+2.5%',
    isPositive: true,
    icon: DollarSign,
    accentClass: 'glass-cyan',
    iconColor: 'text-cyan-400',
    glowClass: 'hover:glow-cyan',
  },
  {
    label: 'Transactions',
    value: '15,203',
    change: '-1.8%',
    isPositive: false,
    icon: Activity,
    accentClass: 'glass-rose',
    iconColor: 'text-rose-400',
    glowClass: '',
  },
  {
    label: 'Avg Swap Time',
    value: '85s',
    change: '-12%',
    isPositive: true,
    icon: Clock,
    accentClass: 'glass-emerald',
    iconColor: 'text-emerald-400',
    glowClass: 'hover:glow-emerald',
  },
  {
    label: 'Supported Chains',
    value: '12',
    change: '+2',
    isPositive: true,
    icon: Link2,
    accentClass: 'glass-amber',
    iconColor: 'text-amber-400',
    glowClass: '',
  },
];

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1]
          }}
          whileHover={{
            y: -4,
            transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }
          }}
          className={`glass rounded-2xl p-6 transition-all duration-300 ${metric.glowClass}`}
        >
          <div className="flex items-start justify-between mb-5">
            <div className={`${metric.accentClass} p-3 rounded-xl`}>
              <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
            </div>
            <div
              className={`flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full ${metric.isPositive
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-rose-500/15 text-rose-400'
                }`}
            >
              {metric.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {metric.change}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1.5 font-medium">{metric.label}</p>
            <p className="text-3xl font-bold text-white tracking-tight">{metric.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
