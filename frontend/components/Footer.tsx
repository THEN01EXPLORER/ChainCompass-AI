'use client';

import { Github, Twitter, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 glass-dark mt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">ChainCompass AI</h3>
            <p className="text-gray-400 text-sm">
              AI-powered cross-chain DeFi route optimization
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Built by Krishnav Mahajan for DeFiTimez Multichain Mayhem Hackathon
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/THENO1EXPLORER/ChainCompass-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all"
            >
              <Github className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all"
            >
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://chaincompass-ai.streamlit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all"
            >
              <Globe className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 text-center text-gray-500 text-sm">
          © 2024 ChainCompass AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
