'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Briefcase, Building2, DollarSign, Wallet, MapPin, Calendar, Shield } from 'lucide-react'
import type { Employee } from '@/hooks/useEmployees'

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Legal', 'Other']
const SCHEDULES = ['Monthly', 'Bi-weekly', 'Weekly']
const STATUSES = ['active', 'pending', 'inactive'] as const

interface Props {
  onClose: () => void
  onSave: (data: Omit<Employee, 'id' | 'avatar' | 'joinDate'>) => void
  initial?: Employee
}

export default function AddEmployeeModal({ onClose, onSave, initial }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    role: initial?.role ?? '',
    department: initial?.department ?? '',
    salary: initial?.salary?.toString() ?? '',
    wallet: initial?.wallet ?? '',
    location: initial?.location ?? '',
    status: initial?.status ?? 'active' as const,
    schedule: initial?.schedule ?? 'Monthly',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.role.trim()) e.role = 'Role is required'
    if (!form.department) e.department = 'Department is required'
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) <= 0) e.salary = 'Valid salary required'
    if (form.wallet && !/^0x[a-fA-F0-9]{40}$/.test(form.wallet)) e.wallet = 'Invalid wallet address'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    onSave({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      department: form.department,
      salary: Number(form.salary),
      wallet: form.wallet.trim(),
      location: form.location.trim(),
      status: form.status,
      schedule: form.schedule,
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
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] flex-shrink-0">
            <div>
              <h2 className="text-base font-semibold text-white">{initial ? 'Edit Employee' : 'Add Employee'}</h2>
              <p className="text-xs text-white/40 mt-0.5">Fill in details to assign USDC salary payments</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg glass border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-6 space-y-4">

              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Jane Smith"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.name ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="jane@company.com" type="email"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.email ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Role + Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Job Title *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.role} onChange={e => set('role', e.target.value)}
                      placeholder="Senior Engineer"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.role ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.role && <p className="text-[11px] text-red-400 mt-1">{errors.role}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Department *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <select value={form.department} onChange={e => set('department', e.target.value)}
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none transition-all appearance-none ${errors.department ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`}>
                      <option value="" className="bg-[#0d0e1a]">Select department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#0d0e1a]">{d}</option>)}
                    </select>
                  </div>
                  {errors.department && <p className="text-[11px] text-red-400 mt-1">{errors.department}</p>}
                </div>
              </div>

              {/* Salary + Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Monthly Salary (USDC) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.salary} onChange={e => set('salary', e.target.value)}
                      placeholder="5000" type="number" min="0" step="0.01"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.salary ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.salary && <p className="text-[11px] text-red-400 mt-1">{errors.salary}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Pay Schedule</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <select value={form.schedule} onChange={e => set('schedule', e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none">
                      {SCHEDULES.map(s => <option key={s} value={s} className="bg-[#0d0e1a]">{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Wallet Address (for USDC payments)</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input value={form.wallet} onChange={e => set('wallet', e.target.value)}
                    placeholder="0x..."
                    className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white font-mono placeholder-white/20 outline-none transition-all ${errors.wallet ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                </div>
                {errors.wallet && <p className="text-[11px] text-red-400 mt-1">{errors.wallet}</p>}
              </div>

              {/* Location + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.location} onChange={e => set('location', e.target.value)}
                      placeholder="Lagos, Nigeria"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none capitalize">
                    {STATUSES.map(s => <option key={s} value={s} className="bg-[#0d0e1a] capitalize">{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Privacy note */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
                <Shield className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="text-xs text-indigo-300">Salary data is encrypted via Arcium MPC during payroll execution</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.07] flex items-center gap-3 flex-shrink-0">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl glass border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : initial ? 'Save Changes' : 'Add Employee'
                }
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
