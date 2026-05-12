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
            className="flex items-center justify-between px-5 py-4 rounded-2xl glass border border-indigo-500/20 bg-indigo-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Connect your wallet to get started</div>
                <div className="text-xs text-white/40 mt-0.5">Link a wallet to Arc Network Testnet to send USDC payroll</div>
              </div>
            </div>
            <div className="text-xs text-indigo-400 flex items-center gap-1 flex-shrink-0">
              Use the connect button above <ArrowRight className="w-3 h-3" />
            </div>
          </motion.div>
        )}

        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl glass border border-green-500/20 bg-green-500/5"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <div className="text-sm text-green-300">
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
              icon: DollarSign, color: 'text-green-400', bg: 'from-green-500/10 to-green-500/5', border: 'border-green-500/15'
            },
            {
              label: 'Total Employees',
              value: employees.length > 0 ? employees.length.toString() : '0',
              sub: activeCount > 0 ? `${activeCount} active` : 'No employees yet',
              icon: Users, color: 'text-violet-400', bg: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/15'
            },
            {
              label: 'Monthly Payroll',
              value: totalMonthlyPayroll > 0 ? mask(totalMonthlyPayroll) : '—',
              sub: totalMonthlyPayroll > 0 ? 'USDC / month' : 'Add employees',
              icon: Calendar, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/15'
            },
            {
              label: 'Runway',
              value: runway ? `${runway} mo` : '—',
              sub: runway ? 'At current burn rate' : 'Add treasury to calculate',
              icon: TrendingUp, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/15'
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
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-white/[0.04]">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">{kpi.value}</div>
                <div className="text-xs text-white/40">{kpi.label}</div>
                <div className="text-[10px] text-white/25 mt-0.5">{kpi.sub}</div>
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
          <div className="text-sm font-semibold text-white mb-4">Quick Actions</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={label}
                href={href}
                className="glass rounded-2xl border border-white/[0.06] p-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center mb-4 shadow-glow-sm group-hover:shadow-glow-md transition-all">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">{label}</div>
                <div className="text-xs text-white/40">{desc}</div>
                <div className="flex items-center gap-1 text-xs text-indigo-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
          className="glass rounded-2xl border border-white/[0.06] overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Payroll Activity</h3>
            <Link href="/payroll" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-14 h-14 rounded-2xl glass border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white/20" />
              </div>
              <div className="text-sm font-semibold text-white mb-2">No payroll activity yet</div>
              <p className="text-xs text-white/40 max-w-sm mx-auto mb-5">
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
            <div className="divide-y divide-white/[0.04]">
              {history.slice(0, 5).map(run => (
                <div key={run.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      run.status === 'completed' ? 'bg-green-400' :
                      run.status === 'partial' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-white">
                        Payroll Run · {run.transactions.length} employee{run.transactions.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-white/40">{new Date(run.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${revealed ? 'text-white' : 'text-indigo-300'}`}>{mask(run.totalPaid)} USDC</div>
                    <div className={`text-[10px] capitalize ${
                      run.status === 'completed' ? 'text-green-400' :
                      run.status === 'partial' ? 'text-amber-400' : 'text-red-400'
                    }`}>{run.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-indigo-500/15 bg-indigo-500/5">
          <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <div className="text-xs text-indigo-300 leading-relaxed">
            <span className="font-semibold">Arcium Confidential Compute is active.</span>{' '}
            All salary data is processed using multi-party computation — no third party, including ArcPay, can see employee compensation figures.
          </div>
        </div>
      </div>
    </div>
  )
}
