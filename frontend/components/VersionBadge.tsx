'use client';

import { motion } from 'framer-motion';
import { Code2, Github } from 'lucide-react';

export default function VersionBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <span className="text-white text-sm font-semibold">v2.0.0</span>
        </div>
        <a
          href="https://github.com/THENO1EXPLORER/ChainCompass-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
        >
          <Github className="w-4 h-4 text-white" />
          <span className="text-white text-xs">Star on GitHub</span>
        </a>
      </div>
    </motion.div>
  );
}
