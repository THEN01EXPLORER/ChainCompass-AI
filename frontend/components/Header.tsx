'use client';

import { motion } from 'framer-motion';
import { Compass, Wallet } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <header className="border-b border-white/10 glass-dark">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-xl">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">ChainCompass AI</h1>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                  v2.0.0
                </span>
              </div>
              <p className="text-sm text-purple-300">Cross-Chain DeFi Analytics • Enhanced Edition</p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnectWallet}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              walletConnected
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
            }`}
          >
            <Wallet className="w-5 h-5" />
            {walletConnected ? 'Connected ✓' : 'Connect Wallet'}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
