'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, Globe, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[160px]" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-indigo-500/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-white/70">Built on Arc Network Testnet</span>
              <span className="text-xs text-indigo-400 font-semibold">Live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white mb-6"
            >
              Confidential AI{' '}
              <span className="gradient-text">Payroll</span>{' '}
              Infrastructure{' '}
              <br className="hidden lg:block" />
              for Global Teams.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl"
            >
              Automate hiring, payroll, treasury, and global stablecoin payments with
              privacy-preserving infrastructure on Arc. Pay anyone, anywhere — in USDC.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col gap-2.5 mb-10"
            >
              {[
                { icon: Shield, text: 'Arcium confidential compute — salaries stay private' },
                { icon: Zap, text: 'AI-powered payroll automation & scheduling' },
                { icon: Globe, text: 'Multi-currency USDC conversion across 10+ currencies' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-white/60">
                  <div className="w-5 h-5 rounded-full glass flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3 h-3 text-indigo-400" />
                  </div>
                  {text}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white gradient-bg-primary hover:opacity-90 transition-all shadow-glow-sm hover:shadow-glow-md group"
              >
                Start Payroll
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-white/80 glass border border-white/10 hover:border-white/20 hover:text-white transition-all"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="glass-strong rounded-2xl border border-white/08 shadow-card overflow-hidden p-6 relative glow-purple">
                {/* Dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-white/40 mb-1">Treasury Overview</div>
                    <div className="text-2xl font-bold text-white">Connect Wallet <span className="text-sm text-white/40 font-normal">to view balance</span></div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-indigo-400" />
                      <span className="text-xs text-indigo-400">Arc Network Testnet</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Chart mockup */}
                <div className="flex items-end gap-1.5 h-24 mb-6">
                  {[42, 55, 38, 70, 60, 80, 68, 90, 75, 85, 78, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                      className="flex-1 rounded-sm origin-bottom"
                      style={{
                        height: `${h}%`,
                        background: i === 11
                          ? 'linear-gradient(to top, #4f46e5, #7c3aed)'
                          : 'rgba(255,255,255,0.07)',
                      }}
                    />
                  ))}
                </div>

                {/* Empty state employees */}
                <div className="space-y-3">
                  {[
                    { label: 'Add your first employee', sub: 'Engineering' },
                    { label: 'Set up payroll schedule', sub: 'Payroll' },
                    { label: 'Connect your treasury', sub: 'Treasury' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-white/20" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-white/40">{item.label}</div>
                          <div className="text-[10px] text-white/20">{item.sub}</div>
                        </div>
                      </div>
                      <div className="text-xs text-indigo-400">→</div>
                    </div>
                  ))}
                </div>

                {/* Confidential badge */}
                <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-indigo-300">Confidential compute enabled — Arcium MPC active</span>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-8 -left-8 animate-float"
              >
                <div className="glass-strong rounded-xl border border-indigo-500/20 p-3.5 min-w-[170px] shadow-card">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-[10px] text-white/50">Arc Network</span>
                  </div>
                  <div className="text-sm font-bold text-white">Testnet Live</div>
                  <div className="text-[10px] text-white/40 mt-0.5">USDC payments ready</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute top-32 -right-12 animate-float-delayed"
              >
                <div className="glass-strong rounded-xl border border-emerald-500/20 p-3.5 min-w-[160px] shadow-card">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-white/50">Arcium MPC</span>
                  </div>
                  <div className="text-sm font-bold text-white">Privacy Active</div>
                  <div className="text-[10px] text-white/40 mt-0.5">Salaries encrypted</div>
                </div>
              </motion.div>

              <div className="absolute inset-0 bg-indigo-600/5 rounded-2xl blur-2xl -z-10 scale-110" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
