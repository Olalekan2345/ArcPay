'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, TrendingUp, Users, Shield, Zap } from 'lucide-react'

export default function ProductPreview() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-violet-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/[0.08] mb-6">
            <span className="text-xs font-medium text-white/60">Live Product</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            A dashboard built for{' '}
            <span className="gradient-text-blue">speed and clarity</span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Navigate your payroll operations at a glance. Every metric you need, instantly visible.
          </p>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="glass-strong rounded-3xl border border-white/[0.08] overflow-hidden shadow-card">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="glass rounded-md px-6 py-1.5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-white/40">app.arcpay.io/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard layout */}
            <div className="flex" style={{ minHeight: 480 }}>
              {/* Sidebar */}
              <div className="w-52 border-r border-white/[0.04] p-4 flex flex-col gap-1 bg-white/[0.01]">
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <div className="w-6 h-6 rounded-md gradient-bg-primary flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">ArcPay</span>
                </div>
                {['Overview', 'Employees', 'Payroll', 'Treasury', 'Hiring', 'AI Agent', 'Analytics'].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      i === 0 ? 'sidebar-active text-white font-medium' : 'text-white/40'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-indigo-400' : 'bg-white/20'}`} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-6 overflow-hidden">
                {/* KPI row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Treasury', value: '$485K', change: '+3.2%', up: true, color: 'text-green-400' },
                    { label: 'Monthly Burn', value: '$55.2K', change: '-1.8%', up: false, color: 'text-red-400' },
                    { label: 'Employees', value: '8', change: '+2', up: true, color: 'text-blue-400' },
                    { label: 'Runway', value: '8.5 mo', change: 'Stable', up: true, color: 'text-yellow-400' },
                  ].map(({ label, value, change, up, color }) => (
                    <div key={label} className="glass rounded-xl p-4 border border-white/[0.06]">
                      <div className="text-[10px] text-white/40 mb-1">{label}</div>
                      <div className="text-lg font-bold text-white">{value}</div>
                      <div className={`text-[10px] ${color} flex items-center gap-0.5 mt-0.5`}>
                        <TrendingUp className="w-2.5 h-2.5" />
                        {change}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Two column */}
                <div className="grid grid-cols-5 gap-4">
                  {/* Chart */}
                  <div className="col-span-3 glass rounded-xl p-4 border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-white">Payroll History</span>
                      <span className="text-[10px] text-white/30">Last 7 months</span>
                    </div>
                    <div className="flex items-end gap-2 h-28">
                      {[42, 44, 48, 48, 55, 55, 63].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-sm"
                            style={{
                              height: `${(h / 63) * 100}%`,
                              background: i === 6
                                ? 'linear-gradient(to top, #4f46e5, #7c3aed)'
                                : 'rgba(255,255,255,0.06)',
                            }}
                          />
                          <span className="text-[8px] text-white/20">
                            {['O', 'N', 'D', 'J', 'F', 'M', 'A'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent payments */}
                  <div className="col-span-2 glass rounded-xl p-4 border border-white/[0.06]">
                    <div className="text-xs font-medium text-white mb-3">Recent Payments</div>
                    <div className="space-y-3">
                      {[
                        { name: 'Sarah C.', amount: '$8,500', status: 'Paid', color: 'text-green-400' },
                        { name: 'Priya S.', amount: '$9,000', status: 'Paid', color: 'text-green-400' },
                        { name: 'David K.', amount: '$8,000', status: 'Pending', color: 'text-yellow-400' },
                        { name: 'Amara O.', amount: '$6,500', status: 'Pending', color: 'text-yellow-400' },
                      ].map((p) => (
                        <div key={p.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full gradient-bg-primary flex items-center justify-center text-[8px] font-bold text-white">
                              {p.name.replace('.', '').split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-[10px] text-white/60">{p.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-medium text-white">{p.amount}</div>
                            <div className={`text-[8px] ${p.color}`}>{p.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow */}
          <div className="absolute inset-0 bg-indigo-600/5 rounded-3xl blur-3xl -z-10 scale-105" />
        </motion.div>
      </div>
    </section>
  )
}
