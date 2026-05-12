'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, FileText, DollarSign, Calendar, Wallet } from 'lucide-react'
import type { Invoice } from '@/hooks/useInvoices'

interface Props {
  onClose: () => void
  onSave: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => void
  initial?: Invoice
}

const STATUSES = ['pending', 'paid', 'overdue', 'draft'] as const

export default function CreateInvoiceModal({ onClose, onSave, initial }: Props) {
  const [form, setForm] = useState({
    client: initial?.client ?? '',
    clientEmail: initial?.clientEmail ?? '',
    description: initial?.description ?? '',
    amount: initial?.amount?.toString() ?? '',
    dueDate: initial?.dueDate ?? '',
    status: initial?.status ?? 'pending' as const,
    walletAddress: initial?.walletAddress ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.client.trim()) e.client = 'Client name is required'
    if (!form.clientEmail.trim() || !/\S+@\S+\.\S+/.test(form.clientEmail)) e.clientEmail = 'Valid email required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Valid amount required'
    if (!form.dueDate) e.dueDate = 'Due date is required'
    if (form.walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(form.walletAddress)) e.walletAddress = 'Invalid wallet address'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    onSave({
      client: form.client.trim(),
      clientEmail: form.clientEmail.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
      dueDate: form.dueDate,
      status: form.status,
      walletAddress: form.walletAddress.trim(),
    })
    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg glass-strong rounded-2xl border border-white/[0.1] shadow-[0_0_80px_rgba(99,102,241,0.12)] overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] flex-shrink-0">
            <div>
              <h2 className="text-base font-semibold text-white">{initial ? 'Edit Invoice' : 'New Invoice'}</h2>
              <p className="text-xs text-white/40 mt-0.5">Bill your client in USDC on Arc Network Testnet</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg glass border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Client Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.client} onChange={e => set('client', e.target.value)}
                      placeholder="Acme Corp"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.client ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.client && <p className="text-[11px] text-red-400 mt-1">{errors.client}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Client Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)}
                      placeholder="billing@acme.com" type="email"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.clientEmail ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.clientEmail && <p className="text-[11px] text-red-400 mt-1">{errors.clientEmail}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Description *</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-white/30" />
                  <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    placeholder="Services rendered for Q1 2025 — Software development..."
                    rows={2}
                    className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all resize-none ${errors.description ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                </div>
                {errors.description && <p className="text-[11px] text-red-400 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Amount (USDC) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.amount} onChange={e => set('amount', e.target.value)}
                      placeholder="5000" type="number" min="0" step="0.01"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.amount ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.amount && <p className="text-[11px] text-red-400 mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Due Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
                      type="date"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none transition-all ${errors.dueDate ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.dueDate && <p className="text-[11px] text-red-400 mt-1">{errors.dueDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Recipient Wallet (for USDC payment)</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input value={form.walletAddress} onChange={e => set('walletAddress', e.target.value)}
                    placeholder="0x..."
                    className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white font-mono placeholder-white/20 outline-none transition-all ${errors.walletAddress ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                </div>
                {errors.walletAddress && <p className="text-[11px] text-red-400 mt-1">{errors.walletAddress}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none capitalize">
                  {STATUSES.map(s => <option key={s} value={s} className="bg-[#0d0e1a] capitalize">{s}</option>)}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/[0.07] flex items-center gap-3 flex-shrink-0">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl glass border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : initial ? 'Save Changes' : 'Create Invoice'
                }
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
