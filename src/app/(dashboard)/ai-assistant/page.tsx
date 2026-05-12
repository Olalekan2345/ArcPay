'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { Brain, Send, User, Sparkles, TrendingUp, Users, Calendar, DollarSign, RefreshCw } from 'lucide-react'
import { useEmployees } from '@/hooks/useEmployees'
import { useWallet } from '@/hooks/useWallet'
import { usePayrollHistory } from '@/hooks/usePayrollHistory'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const quickPrompts = [
  { icon: Calendar, text: 'Summarize my current payroll situation' },
  { icon: DollarSign, text: 'How much USDC do I need for next payroll?' },
  { icon: TrendingUp, text: 'Analyze my treasury burn rate' },
  { icon: Users, text: 'Give me a breakdown of my team by department' },
  { icon: RefreshCw, text: 'Convert $50,000 USDC to NGN estimate' },
]

export default function AIAssistantPage() {
  const { employees, totalMonthlyPayroll, avgSalary, departments } = useEmployees()
  const { formattedUSDC, isConnected, address } = useWallet()
  const { getHistory } = usePayrollHistory()

  const history = getHistory()
  const ytdPayroll = history.reduce((a, r) => a + r.totalPaid, 0)
  const usdcBalance = parseFloat(formattedUSDC)
  const runway = totalMonthlyPayroll > 0 ? (usdcBalance / totalMonthlyPayroll).toFixed(1) : null
  const activeCount = employees.filter(e => e.status === 'active').length

  const systemContext = `You are the ArcPay AI treasury assistant. You have access to the following real-time data about the user's organization on Arc Network Testnet:

- Wallet: ${isConnected ? `Connected (${address?.slice(0, 10)}...)` : 'Not connected'}
- USDC Balance: ${formattedUSDC} USDC on Arc Network Testnet
- Total Employees: ${employees.length} (${activeCount} active)
- Monthly Payroll: $${totalMonthlyPayroll.toLocaleString()} USDC
- Average Salary: $${avgSalary.toLocaleString()} USDC/month
- Departments: ${departments}
- Payroll Runs: ${history.length} total
- YTD Paid: $${ytdPayroll.toLocaleString()} USDC
- Treasury Runway: ${runway ? `${runway} months` : 'N/A (no employees or balance)'}

Answer questions about payroll, treasury management, team structure, and USDC conversions. Be concise and helpful. Use the real data above when answering.`

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm your ArcPay AI assistant powered by GPT-4o. I have access to your live treasury data on Arc Network Testnet.\n\n${
        isConnected
          ? `Your wallet has **${formattedUSDC} USDC** and you have **${employees.length} employee${employees.length !== 1 ? 's' : ''}** with a monthly payroll of **$${totalMonthlyPayroll.toLocaleString()} USDC**.`
          : 'Connect your wallet to get personalized payroll and treasury insights.'
      }\n\nHow can I help you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemContext,
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.error || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection error. Please check your internet and try again.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="AI Assistant"
        subtitle="Powered by GPT-4o · Connected to live treasury data"
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600'
                    : 'bg-gradient-to-br from-indigo-500 to-blue-600'
                }`}>
                  {msg.role === 'assistant' ? <Brain className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>

                <div className={`flex flex-col gap-1 max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'glass border border-white/[0.08] text-white/80 rounded-tr-sm'
                      : 'bg-violet-500/10 border border-violet-500/20 text-white/80 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-white/20">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-violet-500/10 border border-violet-500/20">
                    <div className="flex gap-1 items-center h-4">
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/[0.05]">
            {quickPrompts.map(({ icon: Icon, text }) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/[0.08] text-xs text-white/50 hover:text-white hover:border-white/[0.16] transition-all whitespace-nowrap flex-shrink-0 disabled:opacity-40"
              >
                <Icon className="w-3 h-3" />
                {text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-5 border-t border-white/[0.05]">
            <form
              onSubmit={e => { e.preventDefault(); sendMessage(input) }}
              className="flex items-end gap-3"
            >
              <div className="flex-1 glass rounded-xl border border-white/[0.08] focus-within:border-violet-500/40 transition-all px-4 py-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about payroll, treasury, employees, or conversions..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/25 outline-none"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-11 h-11 rounded-xl gradient-bg-primary flex items-center justify-center shadow-glow-sm hover:opacity-90 transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Right panel — live context */}
        <div className="w-64 border-l border-white/[0.05] p-5 space-y-5 hidden lg:block">
          <div>
            <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Live Context</div>
            <div className="space-y-2">
              {[
                { label: 'USDC Balance', value: isConnected ? `${formattedUSDC}` : '—', color: 'text-green-400' },
                { label: 'Employees', value: `${activeCount} active`, color: 'text-blue-400' },
                { label: 'Monthly Payroll', value: totalMonthlyPayroll > 0 ? `$${totalMonthlyPayroll.toLocaleString()}` : '—', color: 'text-amber-400' },
                { label: 'Runway', value: runway ? `${runway} mo` : '—', color: 'text-violet-400' },
                { label: 'YTD Paid', value: ytdPayroll > 0 ? `$${ytdPayroll.toLocaleString()}` : '$0', color: 'text-indigo-400' },
                { label: 'Network', value: 'Arc Testnet', color: 'text-indigo-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-white/40">{label}</span>
                  <span className={`text-xs font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Capabilities</div>
            <div className="space-y-2">
              {[
                'Payroll analysis',
                'Treasury insights',
                'Currency conversion',
                'Budget planning',
                'Team breakdown',
                'Anomaly detection',
                'On-chain tx help',
              ].map(cap => (
                <div key={cap} className="flex items-center gap-2 text-xs text-white/40">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  {cap}
                </div>
              ))}
            </div>
          </div>

          <div className={`glass rounded-xl border p-3 ${isConnected ? 'border-green-500/15 bg-green-500/5' : 'border-amber-500/15 bg-amber-500/5'}`}>
            <div className={`text-[10px] font-semibold mb-1 ${isConnected ? 'text-green-400' : 'text-amber-400'}`}>
              {isConnected ? 'GPT-4o Connected' : 'Wallet Not Connected'}
            </div>
            <div className="text-[10px] text-white/40">
              {isConnected ? 'Real AI responses via OpenAI API' : 'Connect wallet for full context'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
