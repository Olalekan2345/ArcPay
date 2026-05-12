'use client'

import { useState } from 'react'
import { Bell, Search, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import WalletConnectButton from '@/components/WalletConnectButton'

const notifications = [
  { title: 'Payroll scheduled', desc: 'April payroll set for Apr 1st', time: '2m ago', dot: 'bg-blue-400' },
  { title: 'Payment confirmed', desc: 'Sarah Chen — $8,500 USDC', time: '1h ago', dot: 'bg-green-400' },
  { title: 'New applicant', desc: 'Senior Engineer role — 3 new', time: '3h ago', dot: 'bg-violet-400' },
]

interface HeaderProps {
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void }
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-8 border-b border-white/[0.05] bg-[#07080f]/80 backdrop-blur-xl">
      <div>
        <h1 className="text-base font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/[0.06] w-56">
          <Search className="w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-xs text-white/60 placeholder-white/20 outline-none flex-1"
          />
          <span className="text-[10px] text-white/20 border border-white/[0.08] rounded px-1">⌘K</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-lg glass border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 glass-strong rounded-xl border border-white/[0.08] shadow-card overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <span className="text-xs text-indigo-400">Mark all read</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer">
                      <div className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white">{n.title}</div>
                        <div className="text-[11px] text-white/40 mt-0.5 truncate">{n.desc}</div>
                      </div>
                      <span className="text-[10px] text-white/25 flex-shrink-0">{n.time}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-white/[0.06]">
                  <button className="text-xs text-white/40 hover:text-white/60 transition-colors">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wallet connect */}
        <WalletConnectButton />

        {/* Action button */}
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg-primary text-xs font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            {action.label}
          </button>
        )}
      </div>
    </header>
  )
}
