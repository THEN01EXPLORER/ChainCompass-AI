'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import MetricsGrid from '@/components/MetricsGrid';
import SwapInterface from '@/components/SwapInterface';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import Footer from '@/components/Footer';
import VersionBadge from '@/components/VersionBadge';
import StatsPanel from '@/components/StatsPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MetricsGrid />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <StatsPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <SwapInterface />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <AnalyticsCharts />
          </motion.div>
        </main>

        <Footer />
      </div>

      <VersionBadge />
    </div>
  );
}
