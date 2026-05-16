'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { useEmployees } from '@/hooks/useEmployees'
import { useAttendance } from '@/hooks/useAttendance'
import { useConfidential } from '@/contexts/ConfidentialContext'
import {
  Clock, Play, Square, CheckCircle2, Users, Timer,
  Lock, Unlock, Shield, ChevronRight, AlertCircle,
  Calendar, TrendingUp, Zap
} from 'lucide-react'

function LiveTimer({ clockIn }: { clockIn: string }) {
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    const update = () => {
      const diff = Date.now() - new Date(clockIn).getTime()
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setElapsed(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    update()
    const id = setInterval(update, 1_000)
    return () => clearInterval(id)
  }, [clockIn])

  return (
    <span className="font-mono text-sm font-semibold text-emerald-600 tabular-nums">{elapsed}</span>
  )
}

export default function AttendancePage() {
  const { employees, loading: empLoading } = useEmployees()
  const { clockIn, clockOut, getTodayStatus, getTodayRecord, getWeekSummary } = useAttendance()
  const { revealed, revealing, reveal, conceal, mask } = useConfidential()
  const [tab, setTab] = useState<'today' | 'weekly'>('today')

  const activeEmployees = employees.filter(e => e.status === 'active')
  const weekSummary = getWeekSummary(employees)

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const clockedInCount = activeEmployees.filter(e => getTodayStatus(e.id) === 'clocked-in').length
  const clockedOutCount = activeEmployees.filter(e => getTodayStatus(e.id) === 'clocked-out').length
  const availableCount = activeEmployees.filter(e => getTodayStatus(e.id) === 'available').length

  const totalWeeklyHours = weekSummary.reduce((a, s) => a + s.totalHours, 0)
  const totalWeeklyEarnings = weekSummary.reduce((a, s) => a + s.weeklyEarnings, 0)

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Attendance"
        subtitle="Clock employees in/out · Arcium computes earnings privately"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Staff', value: activeEmployees.length, icon: Users, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200' },
            { label: 'Clocked In', value: clockedInCount, icon: Play, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Clocked Out', value: clockedOutCount, icon: CheckCircle2, color: 'text-slate-500', bg: 'bg-surface-100', border: 'border-slate-200' },
            { label: 'Not Started', value: availableCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-white rounded-xl border ${border} p-4 shadow-card`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">{label}</span>
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface-100 rounded-xl p-1 w-fit">
          {(['today', 'weekly'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-white text-slate-900 shadow-card'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'today' ? "Today's Attendance" : 'Weekly Summary'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'today' ? (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Date banner */}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>{todayLabel}</span>
              </div>

              {empLoading ? (
                <div className="text-center py-16 text-slate-400">Loading employees…</div>
              ) : activeEmployees.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No active employees</p>
                  <p className="text-sm text-slate-400 mt-1">Add employees first to track attendance</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeEmployees.map(emp => {
                    const status = getTodayStatus(emp.id)
                    const rec = getTodayRecord(emp.id)

                    return (
                      <motion.div
                        key={emp.id}
                        layout
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-card"
                      >
                        {/* Employee info */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full gradient-bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {emp.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-900 text-sm truncate">{emp.name}</div>
                            <div className="text-xs text-slate-400 truncate">{emp.role} · {emp.department}</div>
                          </div>
                          {/* Status badge */}
                          {status === 'clocked-in' && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Live
                            </span>
                          )}
                          {status === 'clocked-out' && (
                            <span className="text-[10px] font-semibold text-slate-500 bg-surface-100 border border-slate-200 rounded-full px-2 py-0.5">
                              Done
                            </span>
                          )}
                          {status === 'available' && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                              Not started
                            </span>
                          )}
                        </div>

                        {/* Time info */}
                        <div className="space-y-2 mb-4">
                          {status === 'clocked-in' && rec?.clockIn && (
                            <>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Clocked in at</span>
                                <span className="font-medium text-slate-700">
                                  {new Date(rec.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 flex items-center gap-1"><Timer className="w-3 h-3" /> Elapsed</span>
                                <LiveTimer clockIn={rec.clockIn} />
                              </div>
                            </>
                          )}
                          {status === 'clocked-out' && rec && (
                            <>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Clocked in</span>
                                <span className="font-medium text-slate-700">
                                  {new Date(rec.clockIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Clocked out</span>
                                <span className="font-medium text-slate-700">
                                  {new Date(rec.clockOut!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Hours worked</span>
                                <span className="font-semibold text-brand-600">{rec.hoursWorked?.toFixed(2)}h</span>
                              </div>
                            </>
                          )}
                          {status === 'available' && (
                            <div className="text-xs text-slate-300 text-center py-2">
                              Not clocked in yet today
                            </div>
                          )}
                        </div>

                        {/* Action button */}
                        {status === 'available' && (
                          <button
                            onClick={() => clockIn(emp)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all shadow-glow-sm"
                          >
                            <Play className="w-4 h-4" />
                            Clock In
                          </button>
                        )}
                        {status === 'clocked-in' && (
                          <button
                            onClick={() => clockOut(emp.id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-all"
                          >
                            <Square className="w-3.5 h-3.5 fill-white" />
                            Clock Out
                          </button>
                        )}
                        {status === 'clocked-out' && (
                          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Completed
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="weekly"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Arcium compute panel */}
              <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-card">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Arcium Confidential Compute</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Weekly hours × hourly rate — computed in confidential enclave
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {revealed && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                        <Unlock className="w-3 h-3" />
                        Earnings revealed
                      </div>
                    )}
                    <button
                      onClick={revealed ? conceal : reveal}
                      disabled={revealing}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
                        revealed
                          ? 'bg-surface-100 text-slate-600 border border-slate-200 hover:bg-surface-200'
                          : 'gradient-bg-primary text-white hover:opacity-90 shadow-glow-sm'
                      }`}
                    >
                      {revealing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Computing…
                        </>
                      ) : revealed ? (
                        <><Lock className="w-3.5 h-3.5" /> Conceal</>
                      ) : (
                        <><Zap className="w-3.5 h-3.5" /> Reveal via Arcium</>
                      )}
                    </button>
                  </div>
                </div>

                {!revealed && (
                  <div className="mt-4 flex items-start gap-2 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2.5">
                    <AlertCircle className="w-3.5 h-3.5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-brand-700">
                      Sign with your wallet to authorize Arcium MPC decryption. No transaction will be broadcast — this only proves ownership.
                    </p>
                  </div>
                )}
              </div>

              {/* Weekly totals */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-card">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-brand-600" />
                    <span className="text-xs text-slate-400 font-medium">Total Hours This Week</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{totalWeeklyHours.toFixed(1)}h</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-brand-600" />
                    <span className="text-xs text-slate-400 font-medium">Total Weekly Payroll</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {revealed ? `$${totalWeeklyEarnings.toLocaleString()}` : '••••••'}
                  </div>
                </div>
              </div>

              {/* Per-employee weekly table */}
              {weekSummary.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No active employees</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm">Weekly Breakdown</h3>
                    <span className="text-xs text-slate-400 font-mono">Mon – Fri</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {weekSummary.map(summary => (
                      <div key={summary.employeeId} className="px-5 py-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full gradient-bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {summary.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 text-sm">{summary.employeeName}</div>
                            <div className="text-[11px] text-slate-400">
                              ${summary.hourlyRate.toFixed(2)}/hr · ${summary.monthlySalary.toLocaleString()}/mo
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">{summary.totalHours.toFixed(1)}h</div>
                            <div className={`text-sm font-semibold ${revealed ? 'gradient-text' : 'text-slate-300'}`}>
                              {mask(summary.weeklyEarnings)}
                            </div>
                          </div>
                        </div>

                        {/* Day bubbles */}
                        <div className="flex gap-1.5">
                          {summary.days.map(day => (
                            <div key={day.date} className="flex-1 text-center">
                              <div className="text-[10px] text-slate-300 mb-1 font-medium">{day.label}</div>
                              <div className={`h-9 rounded-lg flex items-center justify-center text-[11px] font-semibold border ${
                                day.status === 'worked'
                                  ? 'bg-brand-50 border-brand-200 text-brand-700'
                                  : day.status === 'in-progress'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 animate-pulse'
                                  : day.status === 'absent'
                                  ? 'bg-surface-50 border-slate-100 text-slate-300'
                                  : 'bg-surface-50 border-dashed border-slate-200 text-slate-200'
                              }`}>
                                {day.status === 'worked' && day.hours != null
                                  ? `${day.hours.toFixed(1)}h`
                                  : day.status === 'in-progress'
                                  ? <ChevronRight className="w-3 h-3" />
                                  : day.status === 'absent'
                                  ? '—'
                                  : '·'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
