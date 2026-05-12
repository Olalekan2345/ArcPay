'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import WalletConnectButton from '@/components/WalletConnectButton'
import { useAccount, useAccountEffect } from 'wagmi'
import { useRouter } from 'next/navigation'

const steps = ['Account', 'Organization', 'Connect']

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    company: '', size: '', role: '',
  })
  const router = useRouter()
  const { isConnected } = useAccount()

  useAccountEffect({
    onConnect() {
      document.cookie = 'wallet_connected=1; path=/; max-age=86400'
      router.push('/dashboard')
    },
  })

  useEffect(() => {
    if (isConnected) {
      document.cookie = 'wallet_connected=1; path=/; max-age=86400'
      router.push('/dashboard')
    }
  }, [isConnected, router])

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const next = async () => {
    if (step < 2) { setStep(s => s + 1); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#05060f] flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Arc<span className="gradient-text-blue">Pay</span></span>
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                i < step ? 'gradient-bg-primary text-white' :
                i === step ? 'border-2 border-indigo-500 text-indigo-400' :
                'border border-white/[0.1] text-white/30'
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs transition-colors ${i === step ? 'text-white' : 'text-white/30'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-indigo-500/50' : 'bg-white/[0.07]'}`} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
              <p className="text-white/40 text-sm mb-8">Get started with ArcPay on Arc Network Testnet</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-xs text-white/30">create account</span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Full name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder="John Smith"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Work email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Set up your organization</h1>
              <p className="text-white/40 text-sm mb-8">We'll customize ArcPay for your team size</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Company name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      value={form.company}
                      onChange={e => update('company', e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Team size</label>
                  <select
                    value={form.size}
                    onChange={e => update('size', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-[#0d0e1a]">Select team size</option>
                    <option value="1-5" className="bg-[#0d0e1a]">1–5 people</option>
                    <option value="6-20" className="bg-[#0d0e1a]">6–20 people</option>
                    <option value="21-50" className="bg-[#0d0e1a]">21–50 people</option>
                    <option value="51-200" className="bg-[#0d0e1a]">51–200 people</option>
                    <option value="200+" className="bg-[#0d0e1a]">200+ people</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Your role</label>
                  <select
                    value={form.role}
                    onChange={e => update('role', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-[#0d0e1a]">Select your role</option>
                    <option value="ceo" className="bg-[#0d0e1a]">CEO / Founder</option>
                    <option value="cfo" className="bg-[#0d0e1a]">CFO / Finance</option>
                    <option value="hr" className="bg-[#0d0e1a]">HR / People Ops</option>
                    <option value="cto" className="bg-[#0d0e1a]">CTO / Engineering</option>
                    <option value="other" className="bg-[#0d0e1a]">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Connect your wallet</h1>
              <p className="text-white/40 text-sm mb-8">Link a wallet to receive and send USDC payments</p>
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-white/50 text-center">Connect your wallet to send and receive USDC payroll on Arc Network Testnet.</p>
                {isConnected ? (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm"
                  >
                    Enter App <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <WalletConnectButton />
                )}
              </div>
              <p className="text-center text-xs text-white/30 mt-4">You can also connect your wallet later from the dashboard.</p>
            </>
          )}
        </motion.div>

        {/* CTA */}
        <button
          onClick={next}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm disabled:opacity-60 group mt-8"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {step === 2 ? 'Go to Dashboard' : 'Continue'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>

        {step === 0 && (
          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        )}

        <p className="text-center text-xs text-white/25 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-white/40 hover:text-white/60 transition-colors">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-white/40 hover:text-white/60 transition-colors">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  )
}
