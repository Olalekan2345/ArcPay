'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Brain, Globe, Users, Layers, RefreshCw,
  BarChart3, Lock, ChevronLeft, ChevronRight
} from 'lucide-react'

const slides = [
  {
    icon: Shield,
    tag: 'Privacy',
    title: 'Confidential Payroll via Arcium MPC',
    description: 'All salary data is encrypted using multi-party computation. Payments execute on-chain without exposing individual compensation figures to any party — including ArcPay.',
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'rgba(99,102,241,0.15)',
    highlight: 'Powered by Arcium confidential compute on Arc Network Testnet.',
  },
  {
    icon: Brain,
    tag: 'AI-Powered',
    title: 'AI Treasury & Payroll Agent',
    description: 'Ask your AI co-pilot to schedule payroll, analyze burn rate, convert currencies, and generate insights — all in natural language. Powered by GPT-4o with live treasury context.',
    gradient: 'from-violet-500 to-fuchsia-600',
    glow: 'rgba(139,92,246,0.15)',
    highlight: 'AI agent reads live wallet balance and payroll history in real time.',
  },
  {
    icon: Globe,
    tag: 'Web3',
    title: 'Global USDC Payments on Arc Network',
    description: 'Pay employees and contractors anywhere in the world instantly in USDC. Settlements finalize on Arc Network Testnet with near-zero gas fees — no banks, no delays.',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6,182,212,0.15)',
    highlight: 'Connect MetaMask or WalletConnect to send live testnet USDC.',
  },
  {
    icon: RefreshCw,
    tag: 'Forex',
    title: 'Live Multi-Currency Conversion',
    description: 'Employees see their USDC salary converted to local currency in real time. Supports NGN, EUR, GBP, INR, KES, CAD, AUD, BRL, SGD, AED, and ZAR — rates refresh every 5 minutes.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.15)',
    highlight: 'Live exchange rates via free public market feeds — no API key required.',
  },
  {
    icon: Layers,
    tag: 'Automation',
    title: 'Batch Payroll & CSV Upload',
    description: 'Upload a CSV with wallet addresses and USDC amounts to pay your entire team in one transaction. Preview totals before executing — up to 500 employees at once.',
    gradient: 'from-orange-500 to-rose-600',
    glow: 'rgba(249,115,22,0.15)',
    highlight: 'Confidential mode encrypts all amounts before on-chain execution.',
  },
  {
    icon: Users,
    tag: 'HR',
    title: 'Hiring & Applicant Tracking',
    description: 'Post job listings, track applicants through interview stages, and onboard contractors directly into payroll — all in one dashboard without switching tools.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.15)',
    highlight: 'From job post to first USDC payment in minutes.',
  },
  {
    icon: BarChart3,
    tag: 'Analytics',
    title: 'Treasury Analytics & Runway Forecasting',
    description: 'Real-time dashboards show monthly burn rate, department payroll breakdowns, team growth trends, and AI-generated runway forecasts based on your live treasury balance.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.15)',
    highlight: 'Runway calculated from live wallet balance and payroll schedule.',
  },
  {
    icon: Lock,
    tag: 'Infrastructure',
    title: 'Supabase-Backed Multi-Tenant Auth',
    description: 'Every organization gets isolated data with row-level security. Sign up with email or Google OAuth, and your payroll data is scoped strictly to your team — no cross-tenant access.',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'rgba(79,70,229,0.15)',
    highlight: 'Built on Supabase with RLS policies enforced at the database level.',
  },
]

export default function FeatureSlideshow() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1)
      setActive(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const go = (index: number) => {
    setDirection(index > active ? 1 : -1)
    setActive(index)
  }

  const prev = () => {
    setDirection(-1)
    setActive(prev => (prev - 1 + slides.length) % slides.length)
  }

  const next = () => {
    setDirection(1)
    setActive(prev => (prev + 1) % slides.length)
  }

  const slide = slides[active]
  const Icon = slide.icon

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-indigo-900/6 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-violet-900/6 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Built for the future of{' '}
            <span className="gradient-text">global payroll</span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Every feature in ArcPay is real, live, and running on Arc Network Testnet.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: slide nav pills */}
          <div className="space-y-2">
            {slides.map((s, i) => {
              const SIcon = s.icon
              return (
                <button
                  key={s.title}
                  onClick={() => go(i)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all ${
                    active === i
                      ? 'glass border border-white/[0.1] bg-white/[0.04]'
                      : 'hover:bg-white/[0.02] border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center flex-shrink-0 transition-all ${active === i ? 'opacity-100' : 'opacity-40'}`}>
                    <SIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate transition-colors ${active === i ? 'text-white' : 'text-white/35 group-hover:text-white/60'}`}>
                      {s.title}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 flex-shrink-0 transition-all ${
                    active === i ? 'text-white/60 border-white/20' : 'text-white/20 border-white/08'
                  }`}>
                    {s.tag}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right: feature card */}
          <div className="relative h-[340px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 glass-strong rounded-2xl border border-white/[0.08] p-8 flex flex-col"
                style={{ boxShadow: `0 0 60px ${slide.glow}` }}
              >
                {/* Icon + tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white/50 border border-white/[0.1] rounded-full px-3 py-1">
                    {slide.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 leading-tight">{slide.title}</h3>

                {/* Description */}
                <p className="text-sm text-white/50 leading-relaxed flex-1">{slide.description}</p>

                {/* Highlight pill */}
                <div className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-xs text-white/40">{slide.highlight}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full glass border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all ${
                  active === i ? 'w-6 h-1.5 bg-indigo-500' : 'w-1.5 h-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full glass border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
