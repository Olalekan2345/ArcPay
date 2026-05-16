'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import Link from 'next/link'
import {
  Play, Clock, Shield, Upload, Download,
  Calendar, Users, DollarSign, Zap, CreditCard,
  CheckSquare, Square, Check, X, AlertCircle,
  ExternalLink, Loader2, UserPlus, Eye, EyeOff
} from 'lucide-react'
import { useEmployees } from '@/hooks/useEmployees'
import { useWallet } from '@/hooks/useWallet'
import { usePayrollHistory, type PayrollRun, type PayrollTx } from '@/hooks/usePayrollHistory'
import { useConfidential } from '@/contexts/ConfidentialContext'

type Tab = 'overview' | 'batch' | 'schedule'
type TxStatus = 'idle' | 'pending' | 'sending' | 'done' | 'error' | 'no-wallet'

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [confidential, setConfidential] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [running, setRunning] = useState(false)
  const [txStatus, setTxStatus] = useState<Record<string, TxStatus>>({})
  const [txHashes, setTxHashes] = useState<Record<string, string>>({})
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([])
  const [runsLoaded, setRunsLoaded] = useState(false)

  const { employees } = useEmployees()
  const { sendUSDC, isConnected, isOnArcTestnet, formattedUSDC } = useWallet()
  const { getHistory, saveRun } = usePayrollHistory()
  const { revealed, revealing, reveal, conceal, mask } = useConfidential()

  // Lazy load history from localStorage
  const loadHistory = useCallback(() => {
    if (!runsLoaded) {
      setPayrollRuns(getHistory())
      setRunsLoaded(true)
    }
  }, [runsLoaded, getHistory])

  if (!runsLoaded) loadHistory()

  const activeEmployees = employees.filter(e => e.status === 'active')
  const selectedEmployees = activeEmployees.filter(e => selected.has(e.id))
  const totalSelected = selectedEmployees.reduce((a, e) => a + e.salary, 0)
  const totalMonthly = activeEmployees.reduce((a, e) => a + e.salary, 0)

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === activeEmployees.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(activeEmployees.map(e => e.id)))
    }
  }

  const executePayroll = async () => {
    if (!isConnected || selectedEmployees.length === 0 || running) return

    setRunning(true)
    const transactions: PayrollTx[] = []

    // Init all selected as pending
    const init: Record<string, TxStatus> = {}
    selectedEmployees.forEach(e => { init[e.id] = e.wallet ? 'pending' : 'no-wallet' })
    setTxStatus(init)

    for (const emp of selectedEmployees) {
      if (!emp.wallet || !/^0x[a-fA-F0-9]{40}$/.test(emp.wallet)) {
        transactions.push({
          employeeId: emp.id, employeeName: emp.name, wallet: emp.wallet || '',
          amount: emp.salary, txHash: '', status: 'failed', error: 'No valid wallet address',
        })
        setTxStatus(prev => ({ ...prev, [emp.id]: 'no-wallet' }))
        continue
      }

      setTxStatus(prev => ({ ...prev, [emp.id]: 'sending' }))

      try {
        const txHash = await sendUSDC(emp.wallet as `0x${string}`, emp.salary)
        setTxStatus(prev => ({ ...prev, [emp.id]: 'done' }))
        setTxHashes(prev => ({ ...prev, [emp.id]: txHash }))
        transactions.push({
          employeeId: emp.id, employeeName: emp.name, wallet: emp.wallet,
          amount: emp.salary, txHash, status: 'success',
        })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        setTxStatus(prev => ({ ...prev, [emp.id]: 'error' }))
        transactions.push({
          employeeId: emp.id, employeeName: emp.name, wallet: emp.wallet,
          amount: emp.salary, txHash: '', status: 'failed', error: msg,
        })
      }
    }

    const successCount = transactions.filter(t => t.status === 'success').length
    const run: PayrollRun = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      transactions,
      totalAmount: totalSelected,
      totalPaid: transactions.filter(t => t.status === 'success').reduce((a, t) => a + t.amount, 0),
      status: successCount === transactions.length ? 'completed' : successCount > 0 ? 'partial' : 'failed',
    }

    saveRun(run)
    setPayrollRuns(getHistory())
    setRunning(false)
    setSelected(new Set())
  }

  const canRun = isConnected && isOnArcTestnet && selectedEmployees.length > 0 && !running

  const StatusIcon = ({ id }: { id: string }) => {
    const s = txStatus[id]
    if (s === 'pending') return <Clock className="w-4 h-4 text-slate-400 animate-pulse" />
    if (s === 'sending') return <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
    if (s === 'done') return <Check className="w-4 h-4 text-emerald-600" />
    if (s === 'error') return <X className="w-4 h-4 text-red-500" />
    if (s === 'no-wallet') return <AlertCircle className="w-4 h-4 text-amber-600" />
    return null
  }

  const handleDownloadTemplate = () => {
    const csv = 'name,wallet_address,amount_usdc\nJane Smith,0x1234...abcd,5000\nJohn Doe,0xabcd...1234,6500'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'arcpay-batch-template.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <Header
        title="Payroll"
        subtitle="Process, schedule, and manage USDC salary payments"
        action={{ label: 'Run Payroll', onClick: () => { setActiveTab('overview'); executePayroll() } }}
      />

      <div className="p-8">
        {/* Wallet / network warning */}
        {!isConnected && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-amber-200 bg-amber-50">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-sm text-amber-600">Connect your wallet to execute payroll — USDC transfers require a connected wallet on Arc Testnet.</span>
          </div>
        )}
        {isConnected && !isOnArcTestnet && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-500">Switch to Arc Network Testnet in your wallet to run payroll.</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 glass rounded-xl border border-slate-100 p-1 mb-8 w-fit">
          {(['overview', 'batch', 'schedule'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'gradient-bg-primary text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'batch' ? 'Batch Payroll' : 'Schedule'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Wallet Balance', value: isConnected ? `${formattedUSDC} USDC` : '—', icon: DollarSign, color: 'text-emerald-600', bg: 'from-emerald-50 to-emerald-50/50', sub: isConnected ? 'Arc Testnet' : 'Connect wallet' },
                { label: 'Total Monthly', value: totalMonthly > 0 ? mask(totalMonthly) : '$0', icon: Calendar, color: 'text-brand-600', bg: 'from-brand-50 to-brand-50/50', sub: 'USDC required' },
                { label: 'Active Employees', value: activeEmployees.length.toString(), icon: Users, color: 'text-violet-600', bg: 'from-violet-50 to-violet-50/50', sub: activeEmployees.length > 0 ? 'Ready for payroll' : 'No employees' },
                { label: 'Network Fees', value: '~$0.01', icon: Zap, color: 'text-amber-600', bg: 'from-amber-50 to-amber-50/50', sub: 'Arc Network low fees' },
              ].map(({ label, value, icon: Icon, color, bg, sub }) => (
                <div key={label} className={`glass rounded-xl border border-slate-100 p-5 bg-gradient-to-b ${bg}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-surface-50">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">{label}</div>
                  <div className="text-xl font-bold text-slate-900">{value}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>

            {/* Execute Payroll */}
            <div className="glass rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Execute Payroll Run</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Select employees and send USDC directly to their wallets</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={revealed ? conceal : reveal}
                    disabled={revealing || !isConnected}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all disabled:opacity-50 ${
                      revealed
                        ? 'bg-brand-50 border-brand-400 text-brand-600'
                        : 'glass border-brand-200 text-brand-600 hover:border-brand-400'
                    }`}
                  >
                    {revealing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Authorizing...</>
                      : revealed ? <><EyeOff className="w-3.5 h-3.5" /> Conceal</>
                      : <><Eye className="w-3.5 h-3.5" /> Reveal Amounts</>}
                  </button>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${confidential ? 'text-brand-600' : 'text-slate-300'}`} />
                    <span className="text-xs text-slate-500">Confidential</span>
                    <button
                      onClick={() => setConfidential(!confidential)}
                      className={`relative w-10 rounded-full transition-all ${confidential ? 'bg-brand-600' : 'bg-slate-200'}`}
                      style={{ height: '22px' }}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${confidential ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {activeEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-xl">
                  <CreditCard className="w-10 h-10 text-slate-200 mb-4" />
                  <div className="text-sm font-semibold text-slate-900 mb-2">No active employees</div>
                  <p className="text-xs text-slate-400 max-w-xs mb-5">
                    Add employees with salary assignments to run USDC payroll on Arc Network.
                  </p>
                  <Link href="/employees" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm">
                    <UserPlus className="w-4 h-4" />
                    Add Employees
                  </Link>
                </div>
              ) : (
                <>
                  {/* Employee list */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden mb-5">
                    <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 bg-surface-50">
                      <button onClick={selectAll} className="text-slate-400 hover:text-slate-900 transition-colors">
                        {selected.size === activeEmployees.length && activeEmployees.length > 0
                          ? <CheckSquare className="w-4 h-4 text-brand-600" />
                          : <Square className="w-4 h-4" />}
                      </button>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex-1">Employee</span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-32">Wallet</span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-28">Amount (USDC)</span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-20">Status</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {activeEmployees.map(emp => (
                        <div key={emp.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-surface-50 transition-colors">
                          <button onClick={() => toggleSelect(emp.id)} className="text-slate-400 hover:text-slate-900 transition-colors flex-shrink-0">
                            {selected.has(emp.id)
                              ? <CheckSquare className="w-4 h-4 text-brand-600" />
                              : <Square className="w-4 h-4" />}
                          </button>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full gradient-bg-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {emp.avatar}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-900 truncate">{emp.name}</div>
                              <div className="text-xs text-slate-400 truncate">{emp.role}</div>
                            </div>
                          </div>
                          <div className="w-32">
                            {emp.wallet
                              ? <span className="text-xs font-mono text-slate-500">{emp.wallet.slice(0, 8)}...{emp.wallet.slice(-4)}</span>
                              : <span className="text-xs text-amber-600">No wallet</span>}
                          </div>
                          <div className={`w-28 text-sm font-semibold ${revealed ? 'text-slate-900' : 'text-brand-600 tracking-widest'}`}>{mask(emp.salary)}</div>
                          <div className="w-20 flex items-center gap-1.5">
                            <StatusIcon id={emp.id} />
                            {txStatus[emp.id] && (
                              <span className="text-[10px] text-slate-400 capitalize">
                                {txStatus[emp.id] === 'no-wallet' ? 'No wallet' : txStatus[emp.id]}
                              </span>
                            )}
                            {txHashes[emp.id] && (
                              <a href={`https://testnet.arcscan.app/tx/${txHashes[emp.id]}`} target="_blank" rel="noreferrer">
                                <ExternalLink className="w-3 h-3 text-brand-600 hover:text-brand-700" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Execute bar */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      {selectedEmployees.length} of {activeEmployees.length} selected ·{' '}
                      <span className={`font-semibold ${revealed ? 'text-slate-900' : 'text-brand-600'}`}>{revealed ? `$${totalSelected.toLocaleString()} USDC` : '•••••• USDC'}</span> total
                    </div>
                    <button
                      onClick={executePayroll}
                      disabled={!canRun}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {running
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                        : <><Play className="w-4 h-4" /> Execute Payroll</>}
                    </button>
                  </div>
                </>
              )}

              {confidential && (
                <div className="mt-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-50 border border-brand-200">
                  <Shield className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  <span className="text-xs text-brand-600">Confidential mode enabled — Arcium MPC will encrypt salary data during execution</span>
                </div>
              )}
            </div>

            {/* Payroll history */}
            <div className="glass rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Payroll History</h3>
              </div>
              {payrollRuns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <Clock className="w-8 h-8 text-slate-200 mb-3" />
                  <div className="text-sm text-slate-400">No payroll runs yet</div>
                  <div className="text-xs text-slate-300 mt-1">Completed payroll transactions will appear here</div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {payrollRuns.map(run => (
                    <div key={run.id} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            run.status === 'completed' ? 'bg-emerald-500' :
                            run.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          <div className="text-sm font-medium text-slate-900">
                            Payroll Run · {new Date(run.date).toLocaleDateString()} {new Date(run.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${revealed ? 'text-slate-900' : 'text-brand-600'}`}>{mask(run.totalPaid)} USDC paid</div>
                          <div className={`text-[10px] capitalize ${
                            run.status === 'completed' ? 'text-emerald-600' :
                            run.status === 'partial' ? 'text-amber-600' : 'text-red-500'
                          }`}>{run.status}</div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {run.transactions.map(tx => (
                          <div key={tx.employeeId} className="flex items-center justify-between text-xs text-slate-400 pl-5">
                            <span>{tx.employeeName}</span>
                            <div className="flex items-center gap-3">
                              <span className={revealed ? '' : 'text-brand-600'}>{mask(tx.amount)}</span>
                              {tx.status === 'success' && tx.txHash ? (
                                <a href={`https://testnet.arcscan.app/tx/${tx.txHash}`} target="_blank" rel="noreferrer"
                                  className="font-mono text-brand-600 hover:text-brand-700 flex items-center gap-1">
                                  {tx.txHash.slice(0, 10)}... <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-red-500">{tx.error || 'Failed'}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="space-y-6">
            <div className="glass rounded-2xl border border-slate-100 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center mx-auto mb-5">
                <Upload className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Batch CSV Upload</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                Upload a CSV with wallet addresses and USDC amounts to process payroll for your entire team at once.
              </p>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 mb-6 hover:border-brand-300 transition-colors cursor-pointer">
                <div className="text-sm text-slate-400">Drop CSV file here or <span className="text-brand-600">browse files</span></div>
                <div className="text-[10px] text-slate-300 mt-1">Columns: name, wallet_address, amount_usdc · Max 500 rows</div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-slate-200 text-sm text-slate-500 hover:text-slate-900 transition-all">
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all">
                  <Upload className="w-4 h-4" />
                  Upload & Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="glass rounded-2xl border border-slate-100 p-12 text-center">
              <div className="w-14 h-14 rounded-2xl glass border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-slate-300" />
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-2">Automated Payroll Schedules</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
                Set up recurring weekly, bi-weekly, or monthly payroll runs. ArcPay will automatically execute USDC transfers on your schedule.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                {['Weekly', 'Bi-weekly', 'Monthly'].map(s => (
                  <div key={s} className="glass rounded-xl border border-slate-100 p-4 text-center cursor-pointer hover:border-brand-200 transition-all">
                    <div className="text-sm font-semibold text-slate-900 mb-1">{s}</div>
                    <div className="text-[10px] text-slate-400">{s === 'Weekly' ? '52×/year' : s === 'Bi-weekly' ? '26×/year' : '12×/year'}</div>
                  </div>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm">
                <Calendar className="w-4 h-4" />
                Create Schedule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
