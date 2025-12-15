'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Palette, Zap, Globe, Save } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    // Save settings logic
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-purple-300">Customize your experience</p>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Transaction Alerts</div>
                  <div className="text-gray-400 text-sm">Get notified when transactions complete</div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    notifications ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications ? 'translate-x-6' : ''
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Trading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-8 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Trading</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-white font-semibold mb-2 block">Slippage Tolerance</label>
                <div className="flex gap-2">
                  {['0.1', '0.5', '1.0', '2.0'].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        slippage === value
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Auto-Approve Transactions</div>
                  <div className="text-gray-400 text-sm">Skip confirmation for small amounts</div>
                </div>
                <button
                  onClick={() => setAutoApprove(!autoApprove)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    autoApprove ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      autoApprove ? 'translate-x-6' : ''
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-8 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">Appearance</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-white font-semibold mb-2 block">Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'dark', label: 'Dark', gradient: 'from-purple-900 to-blue-900' },
                    { value: 'light', label: 'Light', gradient: 'from-purple-200 to-blue-200' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === t.value
                          ? 'border-purple-500'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`w-full h-20 rounded-lg bg-gradient-to-br ${t.gradient} mb-2`}></div>
                      <div className="text-white font-semibold">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-3xl p-8 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Language</h2>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en" className="bg-gray-900">English</option>
              <option value="es" className="bg-gray-900">Español</option>
              <option value="fr" className="bg-gray-900">Français</option>
              <option value="de" className="bg-gray-900">Deutsch</option>
              <option value="zh" className="bg-gray-900">中文</option>
            </select>
          </motion.div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </motion.button>
        </main>

        <Footer />
      </div>
    </div>
  );
}
