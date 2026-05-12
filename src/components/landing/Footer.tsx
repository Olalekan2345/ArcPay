'use client'

import Link from 'next/link'
import { Zap, Twitter, Github, Linkedin } from 'lucide-react'

const links = {
  Product: ['Features', 'Pricing', 'AI Agent', 'Security', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Developers: ['API Docs', 'SDK', 'Arc Network', 'Arcium Docs', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">
                Arc<span className="gradient-text-blue">Pay</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Confidential AI payroll infrastructure for global teams. Built on Arc Network.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg glass border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">{category}</div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2024 ArcPay, Inc. All rights reserved. Built on Arc Network Testnet.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/20">Powered by</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-white/40">Arc Network</span>
              </div>
              <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span className="text-[10px] text-white/40">Arcium MPC</span>
              </div>
              <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-[10px] text-white/40">OpenAI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
