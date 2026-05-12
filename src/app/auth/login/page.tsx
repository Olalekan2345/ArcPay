'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Brain, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAccount, useAccountEffect } from 'wagmi'
import WalletConnectButton from '@/components/WalletConnectButton'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn } = useAuth()
  const { isConnected } = useAccount()

  // Set cookie so middleware lets wallet users through, then redirect
  useAccountEffect({
    onConnect() {
      document.cookie = 'wallet_connected=1; path=/; max-age=86400'
      router.push('/dashboard')
    },
  })

  // Already connected when page loads
  useEffect(() => {
    if (isConnected) {
      document.cookie = 'wallet_connected=1; path=/; max-age=86400'
      router.push('/dashboard')
    }
  }, [isConnected, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#05060f] flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Arc<span className="gradient-text-blue">Pay</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/40">Sign in to your ArcPay account</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-xs text-white/30">sign in with email</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-white/50">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all"
                  required
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm disabled:opacity-60 group mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Sign up free
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-white/[0.07]">
            <p className="text-center text-xs text-white/30 mb-4">Or connect your wallet</p>
            <div className="flex justify-center">
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
          </div>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-900/30 via-violet-900/20 to-[#05060f] border-l border-white/[0.04]">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/15 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/15 rounded-full blur-[60px]" />
        </div>
        <div className="relative flex flex-col items-center justify-center w-full p-16 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-bg-primary flex items-center justify-center mb-8 shadow-glow-md">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Confidential payroll for the modern workforce</h2>
          <p className="text-white/40 text-lg mb-10 max-w-sm">Pay your global team in USDC with AI-powered automation and Arcium privacy on Arc Network Testnet.</p>
          <div className="space-y-3 w-full max-w-sm text-left">
            {[
              { icon: Shield, title: 'Arcium MPC Privacy', desc: 'Salaries encrypted during execution — no data exposed on-chain' },
              { icon: Brain, title: 'AI Treasury Agent', desc: 'GPT-4o powered assistant for payroll, budgets & insights' },
              { icon: Globe, title: 'USDC Global Payments', desc: 'Instant settlement on Arc Network with near-zero fees' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 glass rounded-xl p-4 border border-white/[0.06]">
                <div className="w-9 h-9 rounded-lg gradient-bg-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
