'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import {
  TrendingUp, ArrowUpRight,
  Shield, Wallet, BarChart3, AlertTriangle, RefreshCw, ExternalLink
} from 'lucide-react'
import { CURRENCIES } from '@/lib/constants'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { useWallet } from '@/hooks/useWallet'
import { useEmployees } from '@/hooks/useEmployees'
import { usePayrollHistory } from '@/hooks/usePayrollHistory'
import { useConfidential } from '@/contexts/ConfidentialContext'

const currencyFlags: Record<string, string> = {
  NGN: '🇳🇬', EUR: '🇪🇺', GBP: '🇬🇧', INR: '🇮🇳',
  KES: '🇰🇪', CAD: '🇨🇦', AUD: '🇦🇺', BRL: '🇧🇷',
  SGD: '🇸🇬', AED: '🇦🇪', ZAR: '🇿🇦',
}

const currencySymbols: Record<string, string> = {
  NGN: '₦', EUR: '€', GBP: '£', INR: '₹',
  KES: 'KSh', CAD: 'CA$', AUD: 'A$', BRL: 'R$',
  SGD: 'S$', AED: 'AED', ZAR: 'R',
}

export default function TreasuryPage() {
  const [fromAmount, setFromAmount] = useState('10000')
  const [toCurrency, setToCurrency] = useState('NGN')
  const { data: ratesData, isLoading: ratesLoading, refetch: refetchRates } = useExchangeRates()
  const { formattedUSDC, isConnected, refetchBalance, address } = useWallet()
  const { employees, totalMonthlyPayroll } = useEmployees()
  const { getHistory } = usePayrollHistory()
  const { revealed, mask } = useConfidential()

  const usdcBalance = parseFloat(formattedUSDC)
  const liveRates = ratesData?.rates || {}
  const selectedRate = liveRates[toCurrency] || CURRENCIES.find(c => c.code === toCurrency)?.rate || 1
  const converted = (parseFloat(fromAmount || '0') * selectedRate).toFixed(2)
  const runway = totalMonthlyPayroll > 0 ? (usdcBalance / totalMonthlyPayroll).toFixed(1) : null

  const payrollHistory = getHistory()
  const totalPaid = payrollHistory.reduce((a, r) => a + r.totalPaid, 0)

  return (
    <div>
      <Header title="Treasury" subtitle="Monitor balances, analyze spending, and manage reserves" />

      <div className="p-8 space-y-6">
        {/* Wallet status */}
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl glass border border-amber-200 bg-amber-50"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-sm text-amber-600">Connect your wallet to view your live USDC balance on Arc Network Testnet.</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl glass border border-emerald-200 bg-emerald-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-emerald-600">
                Wallet connected · <span className="font-mono text-xs">{address?.slice(0, 10)}...{address?.slice(-4)}</span>
                {' '}· <span className="font-semibold">{formattedUSDC} USDC</span> on Arc Network Testnet
              </span>
            </div>
            <button onClick={() => refetchBalance()} className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </motion.div>
        )}

        {/* Main balance + stats */}
        <div className="grid grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 glass rounded-2xl border border-slate-100 p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-xs text-slate-400 mb-2">USDC Balance · Arc Testnet</div>
                <div className="text-4xl font-bold text-slate-900">
                  {isConnected ? `$${parseFloat(formattedUSDC).toLocaleString()}` : '—'}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="text-sm font-semibold text-slate-500">USDC</div>
                  {totalMonthlyPayroll > 0 && (
                    <div className="text-xs text-slate-400">
                      Monthly burn: <span className={revealed ? 'text-slate-500' : 'text-brand-600'}>{mask(totalMonthlyPayroll)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-600" />
                <span className="text-xs text-brand-600">Confidential</span>
              </div>
            </div>

            {/* Empty chart placeholder */}
            <div className="flex flex-col items-center justify-center h-[180px] border border-dashed border-slate-200 rounded-xl">
              <BarChart3 className="w-8 h-8 text-slate-200 mb-2" />
              <div className="text-xs text-slate-300">Balance history chart</div>
              <div className="text-[10px] text-slate-200 mt-0.5">Appears after payroll runs</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {[
              {
                label: 'USDC Balance',
                value: isConnected ? `$${parseFloat(formattedUSDC).toLocaleString()}` : '—',
                icon: Wallet, color: 'text-brand-600', bg: 'from-brand-50 to-brand-50/50'
              },
              {
                label: 'Monthly Payroll',
                value: totalMonthlyPayroll > 0 ? mask(totalMonthlyPayroll) : '—',
                icon: AlertTriangle, color: 'text-amber-600', bg: 'from-amber-50 to-amber-50/50'
              },
              {
                label: 'Total Paid Out',
                value: totalPaid > 0 ? mask(totalPaid) : '$0',
                icon: TrendingUp, color: 'text-red-500', bg: 'from-red-50 to-red-50/50'
              },
              {
                label: 'Runway',
                value: runway ? `${runway} mo` : '—',
                icon: BarChart3, color: 'text-emerald-600', bg: 'from-emerald-50 to-emerald-50/50'
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`glass rounded-xl border border-slate-100 p-4 bg-gradient-to-b ${bg}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-[10px] text-slate-400">{label}</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Live currency converter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-slate-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Live Multi-Currency Converter</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {ratesLoading ? 'Fetching live rates...' : ratesData?.fallback ? 'Using fallback rates' : `Live rates · Updated ${new Date(ratesData?.updatedAt || '').toLocaleTimeString()}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetchRates()}
                className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${ratesLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className={`w-1.5 h-1.5 rounded-full ${ratesLoading ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {ratesLoading ? 'Fetching...' : 'Live'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass rounded-xl border border-slate-100 p-4">
              <div className="text-[10px] text-slate-400 mb-2">From (USDC)</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">$</div>
                <input
                  value={fromAmount}
                  onChange={e => setFromAmount(e.target.value)}
                  className="flex-1 bg-transparent text-xl font-bold text-slate-900 outline-none"
                  type="number"
                  min="0"
                />
                <span className="text-xs text-slate-400">USDC</span>
              </div>
            </div>

            <div className="glass rounded-xl border border-brand-200 p-4">
              <div className="text-[10px] text-slate-400 mb-2">To (Local Currency)</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                  <span>{currencyFlags[toCurrency] || '💱'}</span>
                </div>
                <div className="flex-1 text-xl font-bold text-slate-900">
                  {ratesLoading ? '...' : parseFloat(converted).toLocaleString()}
                </div>
                <select
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                  className="text-xs text-brand-600 bg-transparent border-none outline-none cursor-pointer"
                >
                  {Object.keys(currencyFlags).map(code => (
                    <option key={code} value={code} className="bg-white text-slate-900">{code}</option>
                  ))}
                </select>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                1 USDC = {currencySymbols[toCurrency]}{selectedRate.toLocaleString()} {toCurrency}
              </div>
            </div>
          </div>

          {/* Live rate grid */}
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(currencyFlags).slice(0, 8).map(([code, flag]) => {
              const rate = liveRates[code] || 1
              return (
                <button
                  key={code}
                  onClick={() => setToCurrency(code)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                    toCurrency === code
                      ? 'border-brand-400 bg-brand-50'
                      : 'border-slate-100 glass hover:border-slate-200'
                  }`}
                >
                  <span className="text-base">{flag}</span>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-900">{code}</div>
                    <div className="text-[9px] text-slate-400">
                      {ratesLoading ? '...' : rate.toLocaleString()}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Payroll transaction history */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl border border-slate-100 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Payroll Transactions</h3>
          </div>
          {payrollHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <BarChart3 className="w-8 h-8 text-slate-200 mb-3" />
              <div className="text-sm text-slate-400">No transactions yet</div>
              <div className="text-xs text-slate-300 mt-1">Completed payroll runs will appear here</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {payrollHistory.flatMap(run =>
                run.transactions.filter(tx => tx.status === 'success').map(tx => ({
                  ...tx,
                  date: run.date,
                  runId: run.id,
                }))
              ).slice(0, 10).map((tx, i) => (
                <div key={`${tx.runId}-${tx.employeeId}`} className="flex items-center justify-between px-5 py-4 hover:bg-surface-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Salary · {tx.employeeName}</div>
                      <div className="text-xs text-slate-400">{new Date(tx.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-sm font-semibold ${revealed ? 'text-slate-900' : 'text-brand-600'}`}>{mask(tx.amount)}</div>
                    {tx.txHash && (
                      <a href={`https://testnet.arcscan.app/tx/${tx.txHash}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] text-brand-600 font-mono hover:text-brand-700 transition-colors">
                        {tx.txHash.slice(0, 12)}... <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
