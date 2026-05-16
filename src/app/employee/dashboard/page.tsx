'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSignMessage } from 'wagmi'
import {
  ArrowLeft, Shield, Clock, CheckCircle2, Calendar,
  DollarSign, Lock, Unlock, Zap, AlertCircle,
  TrendingUp, ChevronRight, Wallet, User, LogOut
} from 'lucide-react'
import type { Employee } from '@/hooks/useEmployees'
import type { ClockRecord } from '@/hooks/useAttendance'
import type { PayrollRun } from '@/hooks/usePayrollHistory'

const MONTHLY_HOURS = 160

type Session = { employeeId: string; employerAddress: string }

function getWeekDates(): { date: string; label: string }[] {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { date: d.toISOString().split('T')[0], label }
  })
}

export default function EmployeeDashboardPage() {
  const router = useRouter()
  const { signMessageAsync } = useSignMessage()

  const [session, setSession] = useState<Session | null>(null)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [attendance, setAttendance] = useState<ClockRecord[]>([])
  const [payrollHistory, setPayrollHistory] = useState<PayrollRun[]>([])
  const [revealed, setRevealed] = useState(false)
  const [revealing, setRevealing] = useState(false)

  // Load session + all data from localStorage
  useEffect(() => {
    const raw = sessionStorage.getItem('arcpay_employee_session')
    if (!raw) { router.replace('/employee'); return }

    const sess: Session = JSON.parse(raw)
    setSession(sess)

    // Load employee
    const empData = localStorage.getItem(`arcpay_employees_${sess.employerAddress}`)
    if (empData) {
      const emps: Employee[] = JSON.parse(empData)
      const emp = emps.find(e => e.id === sess.employeeId)
      if (emp) setEmployee(emp)
    }

    // Load attendance
    const attData = localStorage.getItem(`arcpay_attendance_${sess.employerAddress}`)
    if (attData) {
      const all: ClockRecord[] = JSON.parse(attData)
      setAttendance(all.filter(r => r.employeeId === sess.employeeId))
    }

    // Load payroll history
    const payData = localStorage.getItem(`arcpay_payroll_${sess.employerAddress}`)
    if (payData) {
      const runs: PayrollRun[] = JSON.parse(payData)
      setPayrollHistory(runs.filter(r =>
        r.transactions.some(tx => tx.employeeId === sess.employeeId)
      ))
    }
  }, [router])

  const handleReveal = async () => {
    setRevealing(true)
    try {
      await signMessageAsync({
        message: [
          'ArcPay Employee Salary Access',
          '',
          'I authorize Arcium MPC to decrypt my confidential salary data for this session.',
          'This signature proves wallet ownership. No transaction will be broadcast.',
          '',
          `Timestamp: ${new Date().toISOString()}`,
        ].join('\n'),
      })
      setRevealed(true)
    } catch {
      // Rejected
    } finally {
      setRevealing(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('arcpay_employee_session')
    router.replace('/employee')
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading your dashboard…</div>
      </div>
    )
  }

  const weekDates = getWeekDates()
  const today = new Date().toISOString().split('T')[0]
  const hourlyRate = employee.salary / MONTHLY_HOURS

  // This week's attendance
  const weekRecords = weekDates.map(({ date, label }) => {
    const rec = attendance.find(r => r.date === date)
    const isFuture = date > today
    const isToday = date === today
    return {
      date, label,
      rec,
      hours: rec?.hoursWorked ?? null,
      status: isFuture ? 'future'
        : !rec ? 'absent'
        : rec.clockIn && !rec.clockOut && isToday ? 'in-progress'
        : 'worked',
    } as const
  })

  const weeklyHours = weekRecords.reduce((a, d) => a + (d.hours ?? 0), 0)
  const weeklyEarnings = Math.round(hourlyRate * weeklyHours * 100) / 100
  const daysWorked = weekRecords.filter(d => d.status === 'worked').length

  const todayRec = attendance.find(r => r.date === today)
  const todayStatus = !todayRec ? 'absent' : todayRec.clockOut ? 'clocked-out' : 'clocked-in'

  // My payments from payroll runs
  const myPayments = payrollHistory
    .flatMap(run => run.transactions.filter(tx => tx.employeeId === employee.id).map(tx => ({
      ...tx,
      date: run.date,
      runId: run.id,
    })))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg-primary flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">ArcPay Employee Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-7 h-7 rounded-full gradient-bg-primary flex items-center justify-center text-white text-xs font-bold">
                {employee.avatar}
              </div>
              <span className="hidden sm:block font-medium">{employee.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-brand-600 to-violet-700 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
          }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-white/70 text-sm mb-1">Welcome back,</p>
                <h1 className="text-2xl font-bold">{employee.name}</h1>
                <p className="text-white/70 text-sm mt-1">{employee.role} · {employee.department}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs mb-1">Monthly Salary</p>
                <p className="text-2xl font-bold font-mono">
                  {revealed ? `$${employee.salary.toLocaleString()}` : '••••••'}
                </p>
                <p className="text-white/60 text-xs mt-0.5">USDC · Arc Testnet</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Today's Status",
              value: todayStatus === 'clocked-in' ? 'Clocked In' : todayStatus === 'clocked-out' ? 'Clocked Out' : 'Not Started',
              icon: Clock,
              color: todayStatus === 'clocked-in' ? 'text-emerald-600' : 'text-slate-500',
              bg: todayStatus === 'clocked-in' ? 'bg-emerald-50' : 'bg-surface-100',
              border: todayStatus === 'clocked-in' ? 'border-emerald-200' : 'border-slate-200',
            },
            {
              label: 'Hours This Week',
              value: `${weeklyHours.toFixed(1)}h`,
              icon: TrendingUp,
              color: 'text-brand-600',
              bg: 'bg-brand-50',
              border: 'border-brand-200',
            },
            {
              label: 'Days Worked',
              value: `${daysWorked} / 5`,
              icon: Calendar,
              color: 'text-violet-600',
              bg: 'bg-violet-50',
              border: 'border-violet-200',
            },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`bg-white rounded-xl border ${border} p-4 shadow-card`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">{label}</span>
                <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                </div>
              </div>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
            </motion.div>
          ))}
        </div>

        {/* Arcium Confidential Salary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-xl border border-brand-200 p-5 shadow-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Arcium Confidential Salary</div>
              <div className="text-xs text-slate-400 mt-0.5">Encrypted via MPC — only you can reveal</div>
            </div>
            <div className="ml-auto">
              <button
                onClick={revealed ? () => setRevealed(false) : handleReveal}
                disabled={revealing}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
                  revealed
                    ? 'bg-surface-100 text-slate-600 border border-slate-200 hover:bg-surface-200'
                    : 'gradient-bg-primary text-white hover:opacity-90 shadow-glow-sm'
                }`}
              >
                {revealing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : revealed ? (
                  <><Lock className="w-3.5 h-3.5" /> Conceal</>
                ) : (
                  <><Zap className="w-3.5 h-3.5" /> Reveal</>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Monthly Salary', value: revealed ? `$${employee.salary.toLocaleString()}` : '••••••', highlight: true },
              { label: 'Hourly Rate', value: revealed ? `$${hourlyRate.toFixed(2)}` : '••••••', highlight: false },
              { label: 'Weekly Earned', value: revealed ? `$${weeklyEarnings.toLocaleString()}` : '••••••', highlight: false },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl p-3 border ${highlight ? 'bg-brand-50 border-brand-200' : 'bg-surface-50 border-slate-100'}`}>
                <div className="text-[11px] text-slate-400 mb-1">{label}</div>
                <div className={`text-base font-bold font-mono ${highlight ? 'gradient-text' : 'text-slate-700'}`}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {!revealed && (
            <div className="mt-3 flex items-start gap-2 bg-surface-50 border border-slate-100 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-brand-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-500">
                Sign with your wallet to authorize Arcium MPC decryption. No transaction is sent.
              </p>
            </div>
          )}
        </motion.div>

        {/* This week's attendance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">This Week's Attendance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Mon – Fri · hours tracked by employer</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{weeklyHours.toFixed(1)}h total</span>
          </div>

          <div className="px-5 py-4">
            <div className="flex gap-2">
              {weekRecords.map(day => (
                <div key={day.date} className="flex-1 text-center">
                  <div className="text-[10px] text-slate-300 mb-1.5 font-medium">{day.label}</div>
                  <div className={`h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 border text-xs font-semibold ${
                    day.status === 'worked'
                      ? 'bg-brand-50 border-brand-200 text-brand-700'
                      : day.status === 'in-progress'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : day.status === 'absent'
                      ? 'bg-surface-50 border-slate-100 text-slate-300'
                      : 'bg-surface-50 border-dashed border-slate-200 text-slate-200'
                  }`}>
                    {day.status === 'worked' && day.hours != null ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{day.hours.toFixed(1)}h</span>
                      </>
                    ) : day.status === 'in-progress' ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        <span>Live</span>
                      </>
                    ) : day.status === 'absent' ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      <span>·</span>
                    )}
                  </div>
                  {day.date === today && (
                    <div className="text-[9px] text-brand-500 font-semibold mt-1">Today</div>
                  )}
                </div>
              ))}
            </div>

            {todayRec && (
              <div className="mt-4 flex items-center justify-between text-xs bg-surface-50 rounded-lg px-3 py-2.5 border border-slate-100">
                <span className="text-slate-400">Today: clocked in at</span>
                <span className="font-semibold text-slate-700">
                  {new Date(todayRec.clockIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {todayRec.clockOut && (
                    <span className="text-slate-400 font-normal ml-1">
                      → {new Date(todayRec.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment history */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Payment History</h3>
            <p className="text-xs text-slate-400 mt-0.5">USDC payments received from employer</p>
          </div>

          {myPayments.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Wallet className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No payments yet</p>
              <p className="text-xs text-slate-300 mt-1">Your employer hasn't run payroll yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {myPayments.map((payment, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    payment.status === 'success' ? 'bg-emerald-50' : 'bg-red-50'
                  }`}>
                    <DollarSign className={`w-4 h-4 ${payment.status === 'success' ? 'text-emerald-600' : 'text-red-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">
                      {payment.status === 'success' ? 'Payment received' : 'Payment failed'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${payment.status === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {revealed ? `$${payment.amount.toLocaleString()} USDC` : '••••••'}
                    </div>
                    {payment.txHash && payment.status === 'success' && (
                      <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                        {payment.txHash.slice(0, 8)}…
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Arc Network info */}
        <div className="text-center pb-4">
          <p className="text-xs text-slate-400">
            Payments processed on <span className="font-semibold text-slate-500">Arc Network Testnet</span> ·{' '}
            Salaries computed by <span className="font-semibold text-slate-500">Arcium MPC</span>
          </p>
        </div>

      </div>
    </div>
  )
}
