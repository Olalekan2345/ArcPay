'use client'

import { useState } from 'react'
import { Bell, Search, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import WalletConnectButton from '@/components/WalletConnectButton'

const notifications = [
  { title: 'Payroll scheduled', desc: 'April payroll set for Apr 1st', time: '2m ago', dot: 'bg-brand-500' },
  { title: 'Payment confirmed', desc: 'Sarah Chen — $8,500 USDC', time: '1h ago', dot: 'bg-green-500' },
  { title: 'New applicant', desc: 'Senior Engineer role — 3 new', time: '3h ago', dot: 'bg-violet-500' },
]

interface HeaderProps {
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void }
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-8 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
      <div>
        <h1 className="text-base font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-surface-50 w-56">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-xs text-slate-600 placeholder-slate-300 outline-none flex-1"
          />
          <span className="text-[10px] text-slate-300 border border-slate-200 rounded px-1">⌘K</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-600" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-slate-200 shadow-card-hover overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-900">Notifications</span>
                  <span className="text-xs text-brand-600 cursor-pointer hover:text-brand-700">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3.5 hover:bg-surface-50 transition-colors cursor-pointer">
                      <div className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-900">{n.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">{n.desc}</div>
                      </div>
                      <span className="text-[10px] text-slate-300 flex-shrink-0">{n.time}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-slate-100">
                  <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors">View all notifications</button>
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
