'use client'

import { motion } from 'framer-motion'
import {
  Shield, Zap, Globe, Users, Layers, RefreshCw,
  BarChart3, Lock, Brain, Clock, FileText, Wallet
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Confidential Payroll',
    description: 'Salary data is encrypted using Arcium confidential compute. Employees receive payments without exposing compensation to third parties.',
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]',
    tag: 'Privacy',
  },
  {
    icon: Brain,
    title: 'AI Treasury Agent',
    description: 'Our AI agent schedules payroll, monitors budgets, detects anomalies, and answers your treasury questions in natural language.',
    gradient: 'from-violet-500 to-fuchsia-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
    tag: 'AI-Powered',
  },
  {
    icon: Globe,
    title: 'Global Stablecoin Payments',
    description: 'Pay contractors and employees in USDC anywhere in the world. Instant settlement on Arc Network with near-zero fees.',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    tag: 'Web3',
  },
  {
    icon: Users,
    title: 'Hiring Management',
    description: 'Post jobs, track applicants, generate offer letters, and onboard contractors with automatic wallet setup and payment configuration.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    tag: 'HR',
  },
  {
    icon: Layers,
    title: 'Batch Payroll',
    description: 'Process payroll for your entire team simultaneously. Upload CSV, preview totals, and execute with a single confidential transaction.',
    gradient: 'from-orange-500 to-rose-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
    tag: 'Automation',
  },
  {
    icon: RefreshCw,
    title: 'Multi-Currency Conversion',
    description: 'Employees receive USDC and instantly see local currency equivalents. Supports NGN, EUR, GBP, INR, KES, CAD, AUD and more.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]',
    tag: 'Forex',
  },
  {
    icon: BarChart3,
    title: 'Treasury Analytics',
    description: 'Real-time treasury dashboards with burn rate tracking, runway forecasting, department spending breakdowns, and AI-generated insights.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    tag: 'Analytics',
  },
  {
    icon: Lock,
    title: 'Confidential Salary Infrastructure',
    description: "Built on Arcium's MPC network. Salary negotiations, raises, and compensation data are computed without revealing values to anyone.",
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(79,70,229,0.2)]',
    tag: 'Infrastructure',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/[0.08] mb-6">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-white/60">Platform Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
            Everything you need to{' '}
            <span className="gradient-text">run global payroll</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            ArcPay combines the power of AI, blockchain, and confidential compute to give you
            a complete payroll infrastructure for distributed teams.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`group glass rounded-2xl p-6 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-default ${feature.glow}`}
              >
                {/* Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-white/30 border border-white/[0.08] rounded-full px-2 py-0.5">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-2.5 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed group-hover:text-white/50 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
