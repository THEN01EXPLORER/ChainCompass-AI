'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Database, AlertCircle } from 'lucide-react';

export default function StatsPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
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
      // Silently fail - backend might not be running
      setError(true);
      // Set mock data for demo
      setStats({
        requests: { total: 0, hit_rate: '0%' },
        cache: { size: 0, max_size: 1000 }
      });
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while loading
  if (loading) return null;
  
  // If error, show a minimal offline indicator
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 mb-8"
      >
        <div className="flex items-center gap-2 text-yellow-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Backend API offline - Demo mode active</span>
        </div>
      </motion.div>
    );
  }
  
  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 mb-8"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-green-400" />
        Live API Statistics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-dark rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-sm">Total Requests</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.requests?.total || 0}
          </div>
        </div>

        <div className="glass-dark rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-sm">Cache Hit Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.requests?.hit_rate || '0%'}
          </div>
        </div>

        <div className="glass-dark rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">Cache Size</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.cache?.size || 0}/{stats.cache?.max_size || 1000}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Updates every 30 seconds • Backend v2.0.0
      </div>
    </motion.div>
  );
}
