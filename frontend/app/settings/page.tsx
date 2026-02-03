'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Palette, Zap, Globe, Save, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${enabled ? 'bg-emerald-500' : 'bg-gray-700'
        }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md ${enabled ? 'left-6' : 'left-1'
          }`}
      />
    </motion.button>
  );

  const sections = [
    {
      icon: Bell,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/10 border-violet-500/20',
      title: 'Notifications',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Transaction Alerts</div>
            <div className="text-gray-500 text-sm">Get notified when transactions complete</div>
          </div>
          <Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />
        </div>
      ),
    },
    {
      icon: Zap,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      title: 'Trading',
      content: (
        <div className="space-y-6">
          <div>
            <label className="text-white font-medium mb-3 block">Slippage Tolerance</label>
            <div className="flex gap-2">
              {['0.1', '0.5', '1.0', '2.0'].map((value) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSlippage(value)}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all ${slippage === value
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {value}%
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Auto-Approve Small Amounts</div>
              <div className="text-gray-500 text-sm">Skip confirmation for transactions under $100</div>
            </div>
            <Toggle enabled={autoApprove} onChange={() => setAutoApprove(!autoApprove)} />
          </div>
        </div>
      ),
    },
    {
      icon: Palette,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      title: 'Appearance',
      content: (
        <div>
          <label className="text-white font-medium mb-3 block">Theme</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'dark', label: 'Dark', gradient: 'from-gray-900 via-violet-950 to-gray-900' },
              { value: 'light', label: 'Light', gradient: 'from-gray-100 via-violet-100 to-gray-100' },
            ].map((t) => (
              <motion.button
                key={t.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setTheme(t.value)}
                className={`p-4 rounded-xl border-2 transition-all ${theme === t.value
                    ? 'border-violet-500 bg-violet-500/5'
                    : 'border-white/10 hover:border-white/20'
                  }`}
              >
                <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${t.gradient} mb-3`} />
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{t.label}</span>
                  {theme === t.value && (
                    <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Globe,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      title: 'Language',
      content: (
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
        >
          <option value="en" className="bg-gray-900">English</option>
          <option value="es" className="bg-gray-900">Español</option>
          <option value="fr" className="bg-gray-900">Français</option>
          <option value="de" className="bg-gray-900">Deutsch</option>
          <option value="zh" className="bg-gray-900">中文</option>
        </select>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

      <div className="relative z-10">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-white">App </span>
              <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-gray-500">Customize your experience</p>
          </motion.div>

          <div className="space-y-5">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2.5 rounded-xl ${section.iconBg} border`}>
                    <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{section.title}</h2>
                </div>
                {section.content}
              </motion.div>
            ))}
          </div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01, boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)' }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            className={`w-full mt-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${saved
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white'
              }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Settings Saved
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </motion.button>
        </main>

        <Footer />
      </div>
    </div>
  );
}
