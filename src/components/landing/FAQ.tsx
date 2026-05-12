'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is Arc Network and how does ArcPay use it?',
    a: 'Arc Network is a high-performance blockchain with confidential compute capabilities. ArcPay uses Arc as its payment layer to process USDC payroll transactions, leveraging Arcium\'s MPC network for privacy-preserving salary calculations.',
  },
  {
    q: 'How does confidential payroll work?',
    a: 'ArcPay uses Arcium\'s multi-party computation (MPC) infrastructure. Salary data is encrypted before computation — meaning payroll is processed without any party (including ArcPay) seeing the actual figures. Only the employee and designated admins can see compensation data.',
  },
  {
    q: 'Can employees receive payments in their local currency?',
    a: 'Employees receive payments in USDC on-chain. ArcPay provides real-time local currency conversion estimates across 12+ currencies (NGN, EUR, GBP, INR, KES, etc.). Integration with local payment rails for direct fiat conversion is coming in Q3 2024.',
  },
  {
    q: 'What wallets are supported?',
    a: 'ArcPay supports MetaMask, WalletConnect, Coinbase Wallet, and any EVM-compatible wallet. Employees can also create custodial wallets directly within the platform for simplified onboarding.',
  },
  {
    q: 'How do I process payroll for contractors in different countries?',
    a: 'Upload a CSV with employee wallet addresses and salary amounts, select your payment schedule, enable confidential mode, and execute. ArcPay handles multi-currency display, tax document generation, and on-chain settlement simultaneously.',
  },
  {
    q: 'Is ArcPay compliant with labor laws and tax regulations?',
    a: 'ArcPay generates payslip records for every transaction executed on-chain. As this is a testnet product, always consult a local payroll and tax expert for jurisdiction-specific compliance requirements before using in production.',
  },
  {
    q: 'What does the AI Treasury Agent actually do?',
    a: 'The AI agent is connected to your live treasury data and can schedule payroll, answer questions about spending patterns, detect anomalous transactions, suggest budget optimizations, generate reports, and alert you to upcoming payment obligations — all in natural language.',
  },
  {
    q: 'What are the transaction fees?',
    a: 'ArcPay covers all Arc Network gas fees. Your only cost is the subscription plan. There are no per-transaction fees, no hidden charges, and no markup on currency conversion rates — we show live market rates.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-5 tracking-tight">
            Frequently asked{' '}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-white/40">
            Everything you need to know about ArcPay. Can't find your answer?{' '}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Contact us.</a>
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`rounded-xl border transition-all ${
                open === i
                  ? 'glass-strong border-indigo-500/20'
                  : 'glass border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className={`text-sm font-medium transition-colors ${open === i ? 'text-white' : 'text-white/70'}`}>
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className={`w-4 h-4 transition-colors ${open === i ? 'text-indigo-400' : 'text-white/30'}`} />
                </motion.div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/[0.06] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
