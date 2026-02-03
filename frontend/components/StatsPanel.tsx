'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Database, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export default function StatsPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/stats');
      if (!response.ok) throw new Error('API not available');
      const data = await response.json();
      setStats(data);
      setError(false);
    } catch (err) {
      setError(true);
      setStats({
        requests: { total: 0, hit_rate: '0%' },
        cache: { size: 0, max_size: 1000 }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-amber-400">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Demo Mode</span>
        </div>
        <span className="text-xs text-gray-500">Backend API offline</span>
      </motion.div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: 'Total Requests',
      value: stats.requests?.total || 0,
      icon: Zap,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10'
    },
    {
      label: 'Cache Hit Rate',
      value: stats.requests?.hit_rate || '0%',
      icon: Activity,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'Cache Usage',
      value: `${stats.cache?.size || 0}/${stats.cache?.max_size || 1000}`,
      icon: Database,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400" />
          Live API Stats
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-gray-500">Auto-refresh 30s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-dark rounded-xl p-4 flex items-center gap-4"
          >
            <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
