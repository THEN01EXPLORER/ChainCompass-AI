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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs for organic feel */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-white">Navigate </span>
              <span className="gradient-text">Cross-Chain</span>
              <span className="text-white"> DeFi</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              AI-powered route optimization for seamless multi-chain swaps
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <MetricsGrid />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <StatsPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12"
          >
            <SwapInterface />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16"
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

