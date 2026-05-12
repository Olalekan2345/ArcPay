'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, Zap, Shield, TrendingUp, Users, Calendar } from 'lucide-react'

const conversations = [
  {
    user: 'Pay all engineering staff next Friday.',
    ai: "I've scheduled payroll for 4 engineering employees totaling $32,300 USDC for Friday, April 12th. Confidential mode is enabled — no salary data will be exposed on-chain. Awaiting your approval.",
    actions: ['Approve Payment', 'View Breakdown'],
  },
  {
    user: 'How much did we spend on payroll this month?',
    ai: "March payroll totaled $55,200 USDC across 7 employees. That's up 14.5% from February ($48,200). Engineering is your largest department at $32,300 (58.5%). Would you like a department breakdown report?",
    actions: ['View Report', 'Export CSV'],
  },
  {
    user: 'Convert treasury balance to NGN estimate.',
    ai: 'Your current USDC treasury balance of $425,000 converts to approximately ₦671,500,000 NGN at the current rate of 1,580 NGN/USDC. Exchange rates update every 5 minutes via live market feeds.',
    actions: ['View Rates', 'Set Alert'],
  },
]

const capabilities = [
  { icon: Calendar, text: 'Schedule & automate payroll runs' },
  { icon: TrendingUp, text: 'Monitor treasury & detect anomalies' },
  { icon: Users, text: 'Answer HR & compensation questions' },
  { icon: Shield, text: 'Analyze payroll compliance risks' },
]

export default function AIAgent() {
  const [activeConv, setActiveConv] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const text = conversations[activeConv].ai
    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1))
        i++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 18)
    return () => clearInterval(interval)
  }, [activeConv])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveConv(prev => (prev + 1) % conversations.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="ai" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/6 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-violet-500/20 mb-8">
              <Brain className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium text-white/60">AI Treasury Agent</span>
              <span className="text-[10px] text-violet-400 border border-violet-500/20 rounded-full px-1.5 py-0.5">GPT-4o</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Your AI-powered{' '}
              <span className="gradient-text">payroll co-pilot</span>
            </h2>

            <p className="text-lg text-white/40 mb-8 leading-relaxed">
              Ask anything. ArcPay's AI agent understands your payroll context, treasury state,
              and team structure — automating tasks that used to take hours.
            </p>

            <div className="space-y-4 mb-10">
              {capabilities.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl glass border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-sm text-white/60">{text}</span>
                </div>
              ))}
            </div>

            {/* Conversation selector */}
            <div className="flex gap-2">
              {conversations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveConv(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeConv === i ? 'w-8 bg-violet-500' : 'w-4 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Chat UI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="glass-strong rounded-2xl border border-white/[0.08] overflow-hidden shadow-card">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">ArcPay AI</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[10px] text-white/40">Online · Connected to treasury</span>
                  </div>
                </div>
              </div>

              {/* Chat body */}
              <div className="p-5 space-y-4 min-h-[340px]">
                {/* Context pill */}
                <div className="flex items-center justify-center">
                  <div className="text-[10px] text-white/30 glass rounded-full px-3 py-1">
                    Connected to treasury · Arcium MPC active · Arc Testnet
                  </div>
                </div>

                {/* User message */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`user-${activeConv}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-xs px-4 py-3 rounded-2xl rounded-tr-sm glass border border-white/[0.08] text-sm text-white/80">
                      {conversations[activeConv].user}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* AI response */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`ai-${activeConv}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-violet-500/10 border border-violet-500/20 text-sm text-white/80 leading-relaxed">
                        {displayedText}
                        {isTyping && (
                          <span className="inline-flex gap-0.5 ml-1">
                            <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        )}
                      </div>
                      {!isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-2 mt-3"
                        >
                          {conversations[activeConv].actions.map((action) => (
                            <button
                              key={action}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-colors"
                            >
                              {action}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3 glass rounded-xl border border-white/[0.08] px-4 py-3">
                  <input
                    type="text"
                    placeholder="Ask about payroll, treasury, employees..."
                    className="flex-1 bg-transparent text-sm text-white/60 placeholder-white/20 outline-none"
                    readOnly
                  />
                  <button className="w-7 h-7 rounded-lg gradient-bg-primary flex items-center justify-center">
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
