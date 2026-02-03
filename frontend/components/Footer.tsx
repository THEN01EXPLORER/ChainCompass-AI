'use client';

import { Github, Twitter, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/THENO1EXPLORER/ChainCompass-AI',
      label: 'GitHub',
      hoverColor: 'hover:text-white hover:bg-white/10'
    },
    {
      icon: Twitter,
      href: '#',
      label: 'Twitter',
      hoverColor: 'hover:text-sky-400 hover:bg-sky-500/10'
    },
    {
      icon: Globe,
      href: 'https://chaincompass-ai.streamlit.app/',
      label: 'Website',
      hoverColor: 'hover:text-emerald-400 hover:bg-emerald-500/10'
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] mt-20">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <h3 className="text-lg font-bold gradient-text">ChainCompass AI</h3>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              AI-powered cross-chain DeFi route optimization
            </p>
            <div className="flex items-center gap-2 justify-center md:justify-start mt-3">
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-md border border-emerald-500/10 font-medium">
                v2.0.0
              </span>
              <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-md border border-violet-500/10 font-medium">
                Production Ready
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl text-gray-400 transition-all ${link.hoverColor}`}
                title={link.label}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} ChainCompass AI. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-rose-500" /> by Krishnav Mahajan
          </p>
        </div>
      </div>
    </footer>
  );
}
