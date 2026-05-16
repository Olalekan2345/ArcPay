'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, User, Shield, Lock } from 'lucide-react'

export default function EmployeePortalPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAccess = () => {
    if (!email.trim()) return
    setLoading(true)
    setError('')

    // Search all employer accounts stored in localStorage
    const keys = Object.keys(localStorage).filter(k => k.startsWith('arcpay_employees_'))
    for (const key of keys) {
      try {
        const employees = JSON.parse(localStorage.getItem(key) || '[]')
        const emp = employees.find((e: { email: string }) =>
          e.email.toLowerCase() === email.trim().toLowerCase()
        )
        if (emp) {
          const employerAddress = key.replace('arcpay_employees_', '')
          // Store session so the dashboard can load data
          sessionStorage.setItem('arcpay_employee_session', JSON.stringify({
            employeeId: emp.id,
            employerAddress,
          }))
          router.push('/employee/dashboard')
          return
        }
      } catch {}
    }

    setError('No account found with that email. Ask your employer to add you in ArcPay.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg-primary flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">ArcPay Employee Portal</span>
          </div>
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Employer Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl gradient-bg-primary flex items-center justify-center mx-auto mb-6 shadow-glow-sm">
            <User className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Employee Portal</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Enter your work email to access your payroll dashboard, attendance records, and confidential salary.
          </p>

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAccess()}
              placeholder="your@company.com"
              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 text-center focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm transition-all"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500"
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={handleAccess}
              disabled={!email.trim() || loading}
              className="w-full h-10 rounded-lg gradient-bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-40 shadow-glow-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><Mail className="w-4 h-4" /> Access My Dashboard</>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-6 leading-relaxed">
            Your salary data is encrypted with{' '}
            <span className="font-semibold text-slate-500">Arcium MPC</span>.
            Only you can reveal it by signing with your wallet.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {[
              { icon: Lock, label: 'ZK-Private' },
              { icon: Shield, label: 'Non-Custodial' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                <Icon className="w-3 h-3 text-brand-500" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
