'use client'

import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import Link from 'next/link'
import {
  DollarSign, Users, Calendar, TrendingUp,
  Shield, ArrowRight, Zap, Plus
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useEmployees } from '@/hooks/useEmployees'
import { usePayrollHistory } from '@/hooks/usePayrollHistory'
import { useConfidential } from '@/contexts/ConfidentialContext'

const quickActions = [
  { label: 'Add Employee', href: '/employees', icon: Users, desc: 'Onboard your first team member' },
  { label: 'Run Payroll', href: '/payroll', icon: DollarSign, desc: 'Process USDC salary payments' },
  { label: 'Post a Job', href: '/hiring', icon: Calendar, desc: 'Start hiring for your team' },
  { label: 'Create Invoice', href: '/invoices', icon: TrendingUp, desc: 'Bill clients in USDC' },
]

export default function DashboardPage() {
  const { isConnected, formattedUSDC, address } = useWallet()
  const { employees, totalMonthlyPayroll } = useEmployees()
  const { getHistory } = usePayrollHistory()
  const { revealed, mask } = useConfidential()

  const history = getHistory()
  const lastRun = history[0]
  const activeCount = employees.filter(e => e.status === 'active').length

  const usdcBalance = parseFloat(formattedUSDC)
  const runway = totalMonthlyPayroll > 0 ? (usdcBalance / totalMonthlyPayroll).toFixed(1) : null

  return (
    <div>
      <Header
        title="Overview"
        subtitle="Welcome to ArcPay — your confidential payroll dashboard"
        action={{ label: 'Add Employee', onClick: () => window.location.href = '/employees' }}
      />

      <div className="p-8 space-y-8">
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-5 py-4 rounded-2xl glass border border-brand-200 bg-brand-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Connect your wallet to get started</div>
                <div className="text-xs text-slate-400 mt-0.5">Link a wallet to Arc Network Testnet to send USDC payroll</div>
              </div>
            </div>
            <div className="text-xs text-brand-600 flex items-center gap-1 flex-shrink-0">
              Use the connect button above <ArrowRight className="w-3 h-3" />
            </div>
          </motion.div>
        )}

        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl glass border border-emerald-200 bg-emerald-50"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-sm text-emerald-600">
              Wallet connected · <span className="font-mono text-xs">{address?.slice(0, 10)}...</span>
              {' '}· <span className="font-semibold">{formattedUSDC} USDC</span> on Arc Network Testnet
            </div>
          </motion.div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Treasury Balance',
              value: isConnected ? `${formattedUSDC} USDC` : '—',
              sub: isConnected ? 'Arc Testnet' : 'Connect wallet',
              icon: DollarSign, color: 'text-emerald-600', bg: 'from-emerald-50 to-emerald-50/50', border: 'border-emerald-200'
            },
            {
              label: 'Total Employees',
              value: employees.length > 0 ? employees.length.toString() : '0',
              sub: activeCount > 0 ? `${activeCount} active` : 'No employees yet',
              icon: Users, color: 'text-violet-600', bg: 'from-violet-50 to-violet-50/50', border: 'border-violet-200'
            },
            {
              label: 'Monthly Payroll',
              value: totalMonthlyPayroll > 0 ? mask(totalMonthlyPayroll) : '—',
              sub: totalMonthlyPayroll > 0 ? 'USDC / month' : 'Add employees',
              icon: Calendar, color: 'text-brand-600', bg: 'from-brand-50 to-brand-50/50', border: 'border-brand-200'
            },
            {
              label: 'Runway',
              value: runway ? `${runway} mo` : '—',
              sub: runway ? 'At current burn rate' : 'Add treasury to calculate',
              icon: TrendingUp, color: 'text-amber-600', bg: 'from-amber-50 to-amber-50/50', border: 'border-amber-200'
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`rounded-2xl p-5 border bg-gradient-to-b ${kpi.bg} ${kpi.border}`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-surface-50">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-0.5">{kpi.value}</div>
                <div className="text-xs text-slate-400">{kpi.label}</div>
                <div className="text-[10px] text-slate-300 mt-0.5">{kpi.sub}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={label}
                href={href}
                className="glass rounded-2xl border border-slate-100 p-5 hover:border-brand-200 hover:bg-brand-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center mb-4 shadow-glow-sm group-hover:shadow-glow-md transition-all">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-slate-900 mb-1">{label}</div>
                <div className="text-xs text-slate-400">{desc}</div>
                <div className="flex items-center gap-1 text-xs text-brand-600 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Get started <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent payroll activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-slate-100 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent Payroll Activity</h3>
            <Link href="/payroll" className="text-xs text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-14 h-14 rounded-2xl glass border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-slate-300" />
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-2">No payroll activity yet</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                Add employees, connect your wallet, and run your first USDC payroll on Arc Network Testnet.
              </p>
              <Link
                href="/employees"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm"
              >
                <Plus className="w-4 h-4" />
                Add First Employee
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.slice(0, 5).map(run => (
                <div key={run.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      run.status === 'completed' ? 'bg-emerald-500' :
                      run.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        Payroll Run · {run.transactions.length} employee{run.transactions.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-slate-400">{new Date(run.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${revealed ? 'text-slate-900' : 'text-brand-600'}`}>{mask(run.totalPaid)} USDC</div>
                    <div className={`text-[10px] capitalize ${
                      run.status === 'completed' ? 'text-emerald-600' :
                      run.status === 'partial' ? 'text-amber-600' : 'text-red-500'
                    }`}>{run.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-brand-200 bg-brand-50">
          <Shield className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <div className="text-xs text-brand-600 leading-relaxed">
            <span className="font-semibold">Arcium Confidential Compute is active.</span>{' '}
            All salary data is processed using multi-party computation — no third party, including ArcPay, can see employee compensation figures.
          </div>
        </div>
      </div>
    </div>
  )
}
