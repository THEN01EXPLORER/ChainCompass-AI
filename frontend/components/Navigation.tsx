'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Home, BarChart3, History, Settings, Menu, X, Briefcase } from 'lucide-react';

import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'History', href: '/history', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="border-b border-white/[0.06] glass-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 p-2.5 rounded-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Compass className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">ChainCompass</h1>
                <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 text-[10px] font-bold rounded-md border border-emerald-500/20">
                  AI
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Cross-Chain DeFi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-full p-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative"
                >
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 ${isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-violet-600/80 to-blue-600/80 rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Wallet Button */}
          <div className="hidden md:flex items-center gap-3">
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">{chain?.name}</p>
                  <p className="text-sm text-white font-medium">{formatAddress(address)}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => disconnect()}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 bg-red-500/10 transition-all"
                >
                  Disconnect
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={openConnectModal}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-blue-600 text-white transition-all"
              >
                Connect Wallet
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden mt-4 space-y-1 overflow-hidden"
            >
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                          ? 'bg-gradient-to-r from-violet-600/30 to-blue-600/30 text-white border border-violet-500/20'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-3 border-t border-white/10">
                {isConnected && address ? (
                  <button
                    onClick={() => {
                      disconnect();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl font-medium text-red-400 bg-red-500/10 border border-red-500/20 transition-all"
                  >
                    Disconnect ({formatAddress(address)})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openConnectModal?.();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-blue-600 text-white transition-all"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
