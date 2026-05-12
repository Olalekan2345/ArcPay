'use client'

import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for small teams and early-stage startups.',
    features: [
      'Up to 10 employees',
      'Monthly payroll processing',
      'USDC payments',
      'Basic analytics',
      'Email support',
      '3 currencies',
    ],
    cta: 'Get started',
    href: '/auth/register',
    highlight: false,
    gradient: 'from-white/5 to-white/[0.02]',
    border: 'border-white/[0.08]',
  },
  {
    name: 'Growth',
    price: '$149',
    period: '/month',
    description: 'For scaling teams that need AI automation and global payments.',
    features: [
      'Up to 50 employees',
      'Batch & recurring payroll',
      'AI Treasury Agent',
      'Multi-currency (12 currencies)',
      'Confidential payroll',
      'Hiring management',
      'CSV export & payslips',
      'Priority support',
    ],
    cta: 'Start free trial',
    href: '/auth/register',
    highlight: true,
    gradient: 'from-indigo-500/15 to-violet-500/10',
    border: 'border-indigo-500/30',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom compliance and integration needs.',
    features: [
      'Unlimited employees',
      'Custom payroll workflows',
      'DAO payroll support',
      'All 45+ currencies',
      'Dedicated AI agent',
      'SLA guarantee',
      'API access',
      'Custom contracts',
      'Dedicated account manager',
    ],
    cta: 'Contact sales',
    href: '/auth/register',
    highlight: false,
    gradient: 'from-white/5 to-white/[0.02]',
    border: 'border-white/[0.08]',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-indigo-900/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Simple, transparent{' '}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Start free. Scale as you grow. No hidden fees, no gas costs — we cover network fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border bg-gradient-to-b ${plan.gradient} ${plan.border} transition-all hover:border-white/[0.16] group`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-bg-primary text-xs font-semibold text-white shadow-glow-sm">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-white/40">{plan.period}</span>
                </div>
                <p className="text-sm text-white/40">{plan.description}</p>
              </div>

              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all mb-8 ${
                  plan.highlight
                    ? 'gradient-bg-primary text-white hover:opacity-90 shadow-glow-sm hover:shadow-glow-md'
                    : 'glass border border-white/10 text-white/80 hover:text-white hover:border-white/20'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlight ? 'bg-indigo-500/20' : 'bg-white/[0.08]'
                    }`}>
                      <Check className={`w-2.5 h-2.5 ${plan.highlight ? 'text-indigo-400' : 'text-white/40'}`} />
                    </div>
                    <span className="text-sm text-white/60">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-white/30 mt-10"
        >
          All plans include 14-day free trial · No credit card required · Cancel anytime
        </motion.p>
      </div>
    </section>
  )
}
