'use client';

import { motion } from 'framer-motion';

export default function VersionBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="glass px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-gray-400">v2.0.0</span>
      </div>
    </motion.div>
  );
}
