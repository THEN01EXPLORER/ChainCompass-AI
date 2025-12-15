'use client';

import { Github, Twitter, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 glass-dark mt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <h3 className="text-white font-bold text-lg">ChainCompass AI</h3>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded">
                v2.0.0
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered cross-chain DeFi route optimization
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Built by Krishnav Mahajan • Production Ready • Docker Enabled
            </p>
            <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
                ✓ Backend Enhanced
              </span>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                ✓ CI/CD Ready
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/THENO1EXPLORER/ChainCompass-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all group"
              title="Star on GitHub"
            >
              <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all group"
              title="Follow on Twitter"
            >
              <Twitter className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="https://chaincompass-ai.streamlit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all group"
              title="Visit Website"
            >
              <Globe className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 ChainCompass AI. All rights reserved. • 
            <span className="text-purple-400"> Enhanced Edition</span> • 
            <a href="https://github.com/THENO1EXPLORER/ChainCompass-AI" className="text-blue-400 hover:underline ml-1">
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
