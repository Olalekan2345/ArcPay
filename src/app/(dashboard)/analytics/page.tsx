'use client'

import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { TrendingUp, Users, DollarSign, Brain, BarChart3, Download } from 'lucide-react'
import { useEmployees } from '@/hooks/useEmployees'
import { usePayrollHistory } from '@/hooks/usePayrollHistory'
import { useWallet } from '@/hooks/useWallet'
import { useConfidential } from '@/contexts/ConfidentialContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#a3e635']

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name?: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-lg border border-white/[0.08] px-3 py-2">
        <p className="text-xs text-white/50 mb-1">{label}</p>
        <p className="text-sm font-semibold text-white">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { employees, totalMonthlyPayroll, avgSalary, departments } = useEmployees()
  const { getHistory } = usePayrollHistory()
  const { formattedUSDC, isConnected } = useWallet()
  const { revealed, mask } = useConfidential()

  const history = getHistory()
  const totalRuns = history.length
  const ytdPayroll = history.reduce((a, r) => a + r.totalPaid, 0)
  const activeCount = employees.filter(e => e.status === 'active').length

  // Department breakdown data for pie chart
  const deptData = Object.entries(
    employees.reduce<Record<string, number>>((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + e.salary
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Payroll run history for bar chart (last 6 runs)
  const runChartData = history.slice(0, 6).reverse().map((r, i) => ({
    name: `Run ${i + 1}`,
    amount: r.totalPaid,
  }))

  // Employee salary distribution
  const salaryRanges = [
    { range: '<$3K', count: employees.filter(e => e.salary < 3000).length },
    { range: '$3K–5K', count: employees.filter(e => e.salary >= 3000 && e.salary < 5000).length },
    { range: '$5K–8K', count: employees.filter(e => e.salary >= 5000 && e.salary < 8000).length },
    { range: '$8K–12K', count: employees.filter(e => e.salary >= 8000 && e.salary < 12000).length },
    { range: '>$12K', count: employees.filter(e => e.salary >= 12000).length },
  ]

  const handleExport = () => {
    const lines = [
      'ArcPay Analytics Export',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      'Summary',
      `YTD Payroll,$${ytdPayroll.toLocaleString()}`,
      `Average Salary,$${avgSalary.toLocaleString()}`,
      `Total Employees,${employees.length}`,
      `Active Employees,${activeCount}`,
      `Payroll Runs,${totalRuns}`,
      `Departments,${departments}`,
      '',
      'Employees',
      'Name,Role,Department,Salary,Status',
      ...employees.map(e => `${e.name},${e.role},${e.department},$${e.salary},${e.status}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'arcpay-analytics.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <Header
        title="Analytics"
        subtitle="Payroll trends, team growth, and AI-generated insights"
        action={{ label: 'Export Report', onClick: handleExport }}
      />

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'YTD Payroll', value: ytdPayroll > 0 ? mask(ytdPayroll) : '—', sub: ytdPayroll > 0 ? 'Total USDC paid out' : 'No payroll data yet', icon: DollarSign },
            { label: 'Avg Salary', value: avgSalary > 0 ? mask(avgSalary) : '—', sub: employees.length > 0 ? 'Per employee / month' : 'Add employees to calculate', icon: TrendingUp },
            { label: 'Team Size', value: employees.length.toString(), sub: `${activeCount} active · ${employees.filter(e => e.status === 'pending').length} pending`, icon: Users },
            { label: 'Payroll Runs', value: totalRuns.toString(), sub: totalRuns > 0 ? 'Total executions' : 'Run payroll to get started', icon: BarChart3 },
          ].map(({ label, value, sub, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-xl border border-white/[0.06] p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-4 h-4 text-white/30" />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/40 mt-0.5">{label}</div>
              <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-white">AI Insights</span>
            <span className="text-[10px] text-violet-400 border border-violet-500/30 rounded-full px-1.5 py-0.5">GPT-4o</span>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {employees.length === 0 ? (
              <>
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-white/60 leading-relaxed">
                  Once you add employees and run payroll, AI will analyze your spend patterns and flag anomalies automatically.
                </div>
                <div className="p-3.5 rounded-xl border border-green-500/20 bg-green-500/5 text-xs text-white/60 leading-relaxed">
                  Treasury runway calculations appear here after connecting your wallet and running your first payroll cycle.
                </div>
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-white/60 leading-relaxed">
                  Department-level payroll breakdowns and benchmark comparisons will be generated as your team grows.
                </div>
              </>
            ) : (
              <>
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-white/60 leading-relaxed">
                  Your largest department by payroll is <span className="text-white font-medium">{deptData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}</span>. Consider budget allocation as you scale.
                </div>
                <div className={`p-3.5 rounded-xl border text-xs text-white/60 leading-relaxed ${totalRuns > 0 ? 'border-green-500/20 bg-green-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                  {totalRuns > 0
                    ? `${totalRuns} payroll run${totalRuns !== 1 ? 's' : ''} completed. Total USDC distributed: $${ytdPayroll.toLocaleString()}.`
                    : 'No payroll runs yet. Head to the Payroll tab to process your first USDC disbursement.'}
                </div>
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-white/60 leading-relaxed">
                  Average salary is <span className="text-white font-medium">${avgSalary.toLocaleString()}/mo</span> across {employees.length} employee{employees.length !== 1 ? 's' : ''} in {departments} department{departments !== 1 ? 's' : ''}.
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Payroll runs chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl border border-white/[0.06] p-6"
          >
            <div className="text-sm font-semibold text-white mb-1">Payroll History</div>
            <div className="text-xs text-white/40 mb-6">USDC paid per run</div>
            {runChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={runChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border border-dashed border-white/[0.06] rounded-xl">
                <BarChart3 className="w-8 h-8 text-white/10 mb-2" />
                <div className="text-xs text-white/20">No data yet</div>
                <div className="text-[10px] text-white/15 mt-0.5">Charts appear after first payroll run</div>
              </div>
            )}
          </motion.div>

          {/* Department breakdown pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-2xl border border-white/[0.06] p-6"
          >
            <div className="text-sm font-semibold text-white mb-1">Payroll by Department</div>
            <div className="text-xs text-white/40 mb-6">Monthly USDC allocation</div>
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {deptData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Payroll']} contentStyle={{ backgroundColor: '#0d0e1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border border-dashed border-white/[0.06] rounded-xl">
                <BarChart3 className="w-8 h-8 text-white/10 mb-2" />
                <div className="text-xs text-white/20">No data yet</div>
                <div className="text-[10px] text-white/15 mt-0.5">Add employees to see breakdown</div>
              </div>
            )}
          </motion.div>

          {/* Salary distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl border border-white/[0.06] p-6"
          >
            <div className="text-sm font-semibold text-white mb-1">Salary Distribution</div>
            <div className="text-xs text-white/40 mb-6">Headcount by salary range (USDC/mo)</div>
            {employees.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={salaryRanges}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d0e1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v: number) => [v, 'Employees']} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border border-dashed border-white/[0.06] rounded-xl">
                <BarChart3 className="w-8 h-8 text-white/10 mb-2" />
                <div className="text-xs text-white/20">No data yet</div>
                <div className="text-[10px] text-white/15 mt-0.5">Add employees to see distribution</div>
              </div>
            )}
          </motion.div>

          {/* Department table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass rounded-2xl border border-white/[0.06] p-6"
          >
            <div className="text-sm font-semibold text-white mb-1">Department Summary</div>
            <div className="text-xs text-white/40 mb-6">Headcount and payroll by department</div>
            {deptData.length > 0 ? (
              <div className="space-y-3">
                {deptData.sort((a, b) => b.value - a.value).slice(0, 6).map(({ name, value }, i) => {
                  const count = employees.filter(e => e.department === name).length
                  const pct = totalMonthlyPayroll > 0 ? ((value / totalMonthlyPayroll) * 100).toFixed(0) : '0'
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-xs text-white/60">{name}</span>
                          <span className="text-[10px] text-white/30">{count} emp</span>
                        </div>
                        <span className="text-xs font-semibold text-white">${value.toLocaleString()}/mo</span>
                      </div>
                      <div className="w-full bg-white/[0.05] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border border-dashed border-white/[0.06] rounded-xl">
                <BarChart3 className="w-8 h-8 text-white/10 mb-2" />
                <div className="text-xs text-white/20">No data yet</div>
                <div className="text-[10px] text-white/15 mt-0.5">Add employees to see breakdown</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
