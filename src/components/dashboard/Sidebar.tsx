'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Zap, LayoutDashboard, Users, CreditCard, Briefcase,
  Vault, FileText, Brain, BarChart3, Settings, LogOut,
  Shield, Wallet, Clock
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', href: '/employees', icon: Users },
  { label: 'Payroll', href: '/payroll', icon: CreditCard },
  { label: 'Attendance', href: '/attendance', icon: Clock, badge: 'New' },
  { label: 'Hiring', href: '/hiring', icon: Briefcase },
  { label: 'Treasury', href: '/treasury', icon: Vault },
  { label: 'Invoices', href: '/invoices', icon: FileText },
  { label: 'AI Assistant', href: '/ai-assistant', icon: Brain, badge: 'AI' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 bottom-0 w-60 flex flex-col border-r border-slate-100 bg-white z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center shadow-glow-sm">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-slate-900 font-semibold text-base">Arc<span className="gradient-text-blue">Pay</span></span>
          <div className="text-[10px] text-slate-400 -mt-0.5">Admin Dashboard</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">Main</div>
        {navItems.slice(0, 7).map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative ${
                active
                  ? 'sidebar-active font-medium'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {item.label}
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-600 rounded-full"
                />
              )}
            </Link>
          )
        })}

        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mt-5 mb-3">Tools</div>
        {navItems.slice(7).map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative ${
                active
                  ? 'sidebar-active font-medium'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold text-brand-700 border border-brand-200 rounded-full px-1.5 py-0.5 bg-brand-50">
                  {item.badge}
                </span>
              )}
              {active && (
                <motion.div
                  layoutId="activeNav2"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-600 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {/* Privacy status */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-brand-50 border border-brand-200">
          <Shield className="w-3.5 h-3.5 text-brand-600" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium text-brand-700">Confidential Mode</div>
            <div className="text-[9px] text-brand-500">Arcium MPC Active</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full gradient-bg-primary flex items-center justify-center flex-shrink-0">
            <Wallet className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-900 truncate">My Account</div>
            <div className="text-[10px] text-slate-400 truncate">Admin</div>
          </div>
          <LogOut className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
